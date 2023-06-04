import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Track} from "../track/track.model";
import { User } from "../user/user.model";

interface ICommentModel {
    author: string
    text: string
    trackId: number
}

@Table({tableName: "comments"})
export class Comment extends Model<Comment, ICommentModel> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, allowNull: false})
    text: string

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Track)
    @Column
    trackId: number

    @BelongsTo(() => Track)
    track: Track
}