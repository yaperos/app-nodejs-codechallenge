import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
    schema: 'public',
    name: 'users',
})
export class UserEntity {

    constructor(id: string) {
        this.id = id;
    }

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 100,
    })
    username: string;

    @Column({
        length: 500,
    })
    password: string;

    @Column({
        length: 500,
    })
    email: string;

    @Column({
        name: 'active',
    })
    active: boolean;
}
