import {Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {Track} from "../track/track.model";

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

    @Column({type: DataType.STRING, allowNull: false})
    author: string

    @ForeignKey(() => Track)
    @Column
    trackId: number
}