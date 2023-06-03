import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "./comment.model";

@Injectable()
export class CommentService {
  constructor(@InjectModel(Comment) private readonly commentProvider: typeof Comment) {}
  async createComment(dto: CreateCommentDto) {
    return await this.commentProvider.create(dto)
  }

  async checkUser(commentId: number, userId: number) {
    const comment = await this.commentProvider.findOne({where: {id: commentId}})
    if(comment.userId !== userId) {
      return false
    }
    return true
  }
  async updateComment(id: number, text: string, userId: number) {
    if(!id) {
      throw new BadRequestException(`${id} doesn't exist`)
    }

    const isCorrectUser = await this.checkUser(id, userId)

    if(isCorrectUser){
      const [rowsAffected, [updatedRecords]] = await this.commentProvider.update({text}, {where: {id}, returning: true})
      if(!rowsAffected) {
        throw new NotFoundException(`Comment ${id} was not found`)
      }
      return updatedRecords
    } else {
      throw new BadRequestException(`It's not your comment`)
    }
  }

  async deleteComment(id: number, userId: number) {
    if(!id) {
      throw new BadRequestException(`Comment ${id} doesn't exist`)
    }
    const isCorrectUser = await this.checkUser(id, userId)

    if(isCorrectUser) {
      return await this.commentProvider.destroy({where: {id}})
    } else {
      throw new BadRequestException(`It's not your comment`)
    }
  }
}
