import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query, Req,
  UploadedFiles, UseGuards,
  UseInterceptors
} from "@nestjs/common";
import { CreateTrackDto } from "./dto/create-track.dto";
import { FileFieldsInterceptor } from "@nestjs/platform-express";
import { Roles } from "../auth/role.decorator";
import { ERole } from "../user/dto/user-create.dto";
import { RoleGuard } from "../auth/role.guard";
import { TrackService } from "./track.service";

@Controller('track')
export class TrackController {

  constructor(private readonly trackService: TrackService) {}


  checkDtoFiles(file) {
    if(file) return file[0]
    return null
  }

  @Roles(ERole.CREATOR)
  @UseGuards(RoleGuard)
  @Post("create")
  @UseInterceptors(FileFieldsInterceptor([
    {name: "picture", maxCount: 1},
    {name: "audio", maxCount: 1}
  ]))
  async create(@Req() req, @UploadedFiles() files, @Body() dto: CreateTrackDto) {
    const { picture, audio } = files
    const {user} = req
    return await this.trackService.createTrack(dto, this.checkDtoFiles(picture), this.checkDtoFiles(audio), user.id)
  }

  @Post("listen/:id")
  async listen(@Param("id") id: number) {
    return await this.trackService.listenTrack(id)
  }

  @Get("all")
  async getAll(
    @Query("limit") limit: number,
    @Query("offset") offset: number
  ) {
    return await this.trackService.getAllTracks(offset, limit)
  }

  @Get("/search/:query")
  async searchTrack(
    @Param("query") query: string,
    @Query("offset") offset: number,
    @Query("limit") limit: number
  ) {
    return await this.trackService.searchTrack(query, offset, limit)
  }
  @Get("/:id")
  async getOneById(@Param("id") id: number){
    return await this.trackService.getOneTrack(id)
  }

  @Roles(ERole.CREATOR)
  @UseGuards(RoleGuard)
  @Delete("delete/:id")
  async deleteOneById(@Req() req, @Param("id") id: number) {
    const {user} = req
    return await this.trackService.deleteTrack(id, user.id)
  }

  @Roles(ERole.CREATOR)
  @UseGuards(RoleGuard)
  @Patch("update/:id")
  @UseInterceptors(FileFieldsInterceptor([
    {name: "picture", maxCount: 1},
    {name: "audio", maxCount: 1}
  ]))
  async updateTrack(@Req() req, @UploadedFiles() files, @Body() dto: CreateTrackDto, @Param("id") id: number) {
    const { picture, audio } = files
    const {user} = req
    return await this.trackService.updateTrack(id, dto, this.checkDtoFiles(picture), this.checkDtoFiles(audio), user.id)
  }

}
