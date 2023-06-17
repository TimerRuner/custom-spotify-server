import { Body, Controller, Delete, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthGuard } from "../auth/auth.guard";
import { CommentService } from "./comment.service";

@Controller('comment')
export class CommentController {

  constructor(private readonly commentService: CommentService) {}
  @UseGuards(AuthGuard)
  @Post("create")
  async createComment(@Req() req, @Body() dto: CreateCommentDto) {
    const {user} = req

    const dtoIn = {...dto, userId: user.id, name: user.fullName}
    return await this.commentService.createComment(dtoIn)
  }

  @UseGuards(AuthGuard)
  @Patch("update/:id")
  async updateComment(@Req() req, @Param("id") id: number, @Body("text") text: string) {
    const {user} = req
    return await this.commentService.updateComment(id, text, user.id)
  }

  @UseGuards(AuthGuard)
  @Delete("delete/:id")
  async deleteComment(@Req() req, @Param("id") id: number) {
    const {user} = req
    return await this.commentService.deleteComment(id, user.id)
  }
}
