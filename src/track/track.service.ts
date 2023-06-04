import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Track } from "./track.model";
import { FilesService } from "../files/files.service";
import { ConfigService } from "@nestjs/config";
import { CreateTrackDto } from "./dto/create-track.dto";
import { Op } from "sequelize";
import { Comment } from "../comment/comment.model";
import { UpdateTrackDto } from "./dto/update-track.dto";
import { CommentService } from "../comment/comment.service";

@Injectable()
export class TrackService {
  constructor(
    @InjectModel(Track) private readonly trackProvider: typeof Track,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly commentService: CommentService
  ) {}

  async checkUser(id: number, userId: number) {
    const comment = await this.trackProvider.findOne({where: {id}})
    if(comment.userId !== userId) {
      return false
    }
    return true
  }

  async createTrack(dto: CreateTrackDto, picture, audio, userId) {
    const track = await this.trackProvider.findOne({where: {name: dto.name}})
    if(track) {
      throw new BadRequestException(`Track with name ${dto.name} already exist`)
    }
    const pictureSource = await this.filesService.uploadFile(picture, this.configService.get("BUCKET_NAME"))
    const audioSource = await this.filesService.uploadFile(audio, this.configService.get("BUCKET_NAME"))
    return await this.trackProvider.create({...dto, audio: audioSource, picture: pictureSource, userId})
  }

  async listenTrack(id: number) {
    if(!id) {
      throw new BadRequestException("Id doesn't exist")
    }
    try {
      const track = await this.trackProvider.findOne({where: {id}})
      if(!track){
        throw new HttpException(`Track with id - ${id} not found`, HttpStatus.BAD_REQUEST)
      }
      track.listens += 1
      return await track.save()
    } catch (e) {
      throw new BadRequestException(`Error loading track`)
    }
  }

  async getAllTracks(offset: number = 0, limit: number = 0) {
    return await this.trackProvider.findAll({
      limit,
      offset,
      include: [Comment]
    })
  }

  async getOneTrack(id: number) {
    if(!id) {
      throw new BadRequestException("Id doesn't exist")
    }
    const track = await this.trackProvider.findOne({where: {id}, include: [Comment]})
    if(!track) {
      throw new HttpException(`Track with id - ${id} doesn't exist`, HttpStatus.BAD_REQUEST)
    }
    return track
  }

  async searchTrack(query: string) {
    return await this.trackProvider.findAll({where: {name: {[Op.iLike]: `%${query}%`}}, include: [Comment]})
  }

  async deleteTrack(id: number, userId: number) {
    const isCorrectUser = await this.checkUser(id, userId)
    if(isCorrectUser){
      if(!id) {
        throw new BadRequestException("Id doesn't exist")
      }
      const track = await this.trackProvider.findOne({where: {id}})
      if(!track) {
        throw new BadRequestException(`Track by this id doesn't exist`)
      }
      await this.filesService.deleteFile(this.configService.get("BUCKET_NAME"), track.picture)
      await this.filesService.deleteFile(this.configService.get("BUCKET_NAME"), track.audio)


      const deletedTrack= await this.trackProvider.destroy({where: {id}})
      await this.commentService.deleteAllByTrackId(id)
      return deletedTrack
    } else {
      throw new BadRequestException(`It's not your track`)
    }
  }

  async updateTrack(id: number, dto: CreateTrackDto, picture, audio, userId: number) {
    const isCorrectUser = await this.checkUser(id, userId)
    if(isCorrectUser){
      let pictureSource, audioSource
      const dtoIn: UpdateTrackDto = {...dto}
      if(!id) {
        throw new BadRequestException("Id doesn't exist")
      }
      const trackByName = await this.trackProvider.findOne({where: {name: dto.name}})
      if(trackByName) {
        throw new BadRequestException("Track with such name already exist")
      }
      const track = await this.trackProvider.findOne({where: {id}})
      if(!track) {
        throw new BadRequestException(`Track wasn't found by this id - ${id}`)
      }
      if(picture){
        await this.filesService.deleteFile(this.configService.get("BUCKET_NAME"), track.picture)
        pictureSource = await this.filesService.uploadFile(picture, this.configService.get("BUCKET_NAME"))
        dtoIn.picture = pictureSource
      }
      if(audio){
        await this.filesService.deleteFile(this.configService.get("BUCKET_NAME"), track.audio)
        audioSource = await this.filesService.uploadFile(audio, this.configService.get("BUCKET_NAME"))
        dtoIn.audio = audioSource
      }
      if (!picture) delete dtoIn.picture
      if (!audio) delete dtoIn.audio

      const [rowsAffected, [updatedRecords]] = await this.trackProvider.update(dtoIn, {where: {id}, returning: true})
      if(!rowsAffected) {
        throw new NotFoundException(`Track with id ${id} does not exist`)
      }
      return updatedRecords
    } else {
      throw new BadRequestException(`It's not your track`)
    }
  }

  async removeAlbomsId(albomId: number) {
    await this.trackProvider.update({albomId: null}, {where: {albomId}})
  }
}
