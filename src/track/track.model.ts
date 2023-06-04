import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";
import {Albom} from "../albom/albom.model";
import {Comment} from "../comment/comment.model";

interface ITrackModel {
    name: string
    artist: string
    text: string
    listens: number
    picture: string
    audio: string
    userId: number
}

@Table({ tableName: "tracks", createdAt: false, updatedAt: false })
export class Track extends Model<Track> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, unique: true})
    name: string

    @Column({type: DataType.STRING, allowNull: false})
    artist: string

    @Column({type: DataType.STRING, allowNull: true})
    text: string

    @Column({type: DataType.INTEGER, allowNull: false, defaultValue: 0 })
    listens: number

    @Column({type: DataType.STRING, allowNull: true})
    picture: string

    @Column({type: DataType.STRING, allowNull: false})
    audio: string

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User

    @ForeignKey(() => Albom)
    @Column
    albomId: number

    @BelongsTo(() => Albom)
    albom: Albom

    @HasMany(() => Comment)
    comments: Comment[]
}