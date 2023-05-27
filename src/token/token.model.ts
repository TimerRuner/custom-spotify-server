import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";

interface ITokenModel {
    refreshToken: string

}

@Table({tableName: "tokens"})
export class Token extends Model<Token, ITokenModel> {
    @Column({type: DataType.INTEGER, unique: true, primaryKey: true, autoIncrement: true})
    id: number

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    refreshToken: string

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}