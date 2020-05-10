import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

class AddAvatarFieldToUsers1589078136713 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'users',
            new TableColumn({
                name: 'avatar',
                type: 'varchar',
                isNullable: true,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('users', 'avatar');
    }
}

export default AddAvatarFieldToUsers1589078136713;
