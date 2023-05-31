import {BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";
import {Track} from "../track/track.model";

interface IAlbomModel {
    name: string
    userId: number
    picture: string
}

@Table({tableName: "alboms"})
export class Albom extends Model<Albom, IAlbomModel> {
    @Column({type:DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING})
    picture: string

    @Column({type: DataType.STRING, allowNull: true, unique: true})
    name: string

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User

    @HasMany(() => Track)
    tracks: Track[]
}