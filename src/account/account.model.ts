import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from "sequelize-typescript";
import {User} from "../user/user.model";

interface IAccountModel {
    activationLink: string
    isActivated: boolean
}
@Table({tableName: "accounts"})
export class Account extends Model<Account, IAccountModel> {
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    id: number

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    activationLink: string

    @Column({type: DataType.BOOLEAN, defaultValue: false })
    isActivated: boolean

    @ForeignKey(() => User)
    @Column
    userId: number

    @BelongsTo(() => User)
    user: User
}