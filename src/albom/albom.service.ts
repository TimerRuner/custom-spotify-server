import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateAlbomDto } from "./dto/create-albom.dto";
import { UpdateAlbomDto } from "./dto/update-albom.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Albom } from "./albom.model";
import { ConfigService } from "@nestjs/config";
import { FilesService } from "../files/files.service";
import { Track } from "../track/track.model";
import { Op } from "sequelize";
import { TrackService } from "../track/track.service";

@Injectable()
export class AlbomService {

  constructor(
    @InjectModel(Albom) private readonly albomProvider: typeof Albom,
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    private readonly trackService: TrackService
  ) {}

  async checkUser(id: number, userId: number) {
    const comment = await this.albomProvider.findOne({where: {id}})
    if(comment.userId !== userId) {
      return false
    }
    return true
  }
  async create(dto: CreateAlbomDto, picture, userId: number) {
    const albom = await this.albomProvider.findOne({where: {name: dto.name}})
    if(albom) {
      throw new BadRequestException(`Albom with name ${dto.name} already exist`)
    }
    const pictureSource = await this.filesService.uploadFile(picture, this.configService.get("BUCKET_NAME"))
    return await this.albomProvider.create({...dto, userId, picture: pictureSource})
  }

  async getAll(offset: number = 0, limit: number = 0){
    return await this.albomProvider.findAll({
      limit,
      offset,
      include: [Track]
    })
  }

  async getAlbom(id: number) {
    if(!id) {
      throw new BadRequestException("Id doesn't exist")
    }
    const albom = await this.albomProvider.findOne({where: {id}, include: [Track]})
    if(!albom) {
      throw new BadRequestException(`Albom with id - ${id} doesn't exist`)
    }
    return albom
  }

  async searchAlboms(query: string) {
    return await this.albomProvider.findAll({where: {name: {[Op.iLike]: `%${query}%`}}, include: [Track]})
  }

  async updateAlbom(id: number, dto: UpdateAlbomDto, picture, userId: number) {
    let pictureSource
    const dtoIn: UpdateAlbomDto = {...dto}
    const isCorrectUser = await this.checkUser(id, userId)
    if(isCorrectUser) {
      if(!id) {
        throw new BadRequestException("Id doesn't exist")
      }

      const albomByName = await this.albomProvider.findOne({where: {name: dto.name}})
      if(albomByName) {
        throw new BadRequestException("Albom with such name already exist")
      }

      const albom = await this.albomProvider.findOne({where: {id}})
      if(!albom) {
        throw new BadRequestException(`Albom wasn't found by this id - ${id}`)
      }

      if(picture){
        await this.filesService.deleteFile(this.configService.get("BUCKET_NAME"), albom.picture)
        pictureSource = await this.filesService.uploadFile(picture, this.configService.get("BUCKET_NAME"))
        dtoIn.picture = pictureSource
      }

      if (!picture) delete dtoIn.picture

      const [rowsAffected, [updatedRecords]] = await this.albomProvider.update(dtoIn, {where: {id}, returning: true})
      if(!rowsAffected) {
        throw new NotFoundException(`Albom with id ${id} does not exist`)
      }

      return updatedRecords
    } else {
      throw new BadRequestException(`It's not your albom`)
    }
  }

  async deleteAlbom(id: number, userId: number) {
    const isCorrectUser = await this.checkUser(id, userId)
    if(!id) {
      throw new BadRequestException("Id doesn't exist")
    }
    if(isCorrectUser) {
      await this.trackService.removeAlbomsId(id)
      return await this.albomProvider.destroy({where: {id}})
    } else {
      throw new BadRequestException(`It's not your albom`)
    }
  }

}
