import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSeed1771888557959 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO emotion_processing_styles (id, title)
      VALUES
        (uuid_generate_v4(), 'Suelo escribir o llevar un diario'),
        (uuid_generate_v4(), 'Me ayuda hacer ejercicio'),
        (uuid_generate_v4(), 'Hablo con alguien en quien confío'),
        (uuid_generate_v4(), 'Medito o respiro'),
        (uuid_generate_v4(), 'Me cuesta expresarlas'),
        (uuid_generate_v4(), 'No tengo una estrategia definida')
      ON CONFLICT (title) DO NOTHING;
    `);
    await queryRunner.query(`
      INSERT INTO emotional_goals (id, title)
      VALUES
        (uuid_generate_v4(), 'Manejar mis emociones'),
        (uuid_generate_v4(), 'Encontrar más calma o estabilidad'),
        (uuid_generate_v4(), 'Conectar con mi interior y expresarme'),
        (uuid_generate_v4(), 'Seguir mi progreso personal'),
        (uuid_generate_v4(), 'Crear hábitos saludables')
      ON CONFLICT (title) DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO plants (id, name, represents)
      VALUES
        (uuid_generate_v4(), 'Loto Sereno', 'Calma interior'),
        (uuid_generate_v4(), 'Girasol Valiente', 'Confianza y fuerza'),
        (uuid_generate_v4(), 'Orquídea Libre', 'Expresión emocional')
      ON CONFLICT (name) DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO plant_stages (id, "imageUrl", "requiredProgress", "plantId")
      SELECT
        uuid_generate_v4(),
        '/plants/loto-sereno/stage-1.png',
        0,
        p.id
      FROM plants p
      WHERE p.name = 'Loto Sereno'
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO plant_stages (id, "imageUrl", "requiredProgress",  "plantId")
      SELECT
        uuid_generate_v4(),
        '/plants/loto-sereno/stage-2.png',
        25,
        p.id
      FROM plants p
      WHERE p.name = 'Loto Sereno'
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO plant_stages (id, "imageUrl", "requiredProgress",  "plantId")
      SELECT
        uuid_generate_v4(),
        '/plants/loto-sereno/stage-3.png',
        60,
        p.id
      FROM plants p
      WHERE p.name = 'Loto Sereno'
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO plant_stages (id, "imageUrl", "requiredProgress", "plantId")
      SELECT
        uuid_generate_v4(),
        '/plants/loto-sereno/stage-4.png',
        100,
        p.id
      FROM plants p
      WHERE p.name = 'Loto Sereno'
      ON CONFLICT DO NOTHING;
    `);

    await queryRunner.query(`
      INSERT INTO plant_seasons (id, "plantId", "startDate", "endDate", "isActive")
      SELECT
        uuid_generate_v4(),
        p.id,
        '2026-03-01',
        '2026-05-31',
        true
      FROM plants p
      WHERE p.name IN (
        'Loto Sereno',
        'Girasol Valiente',
        'Orquídea Libre'
      )
      ON CONFLICT DO NOTHING;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM plants WHERE name IN (
        'Loto Sereno',
        'Girasol Valiente',
        'Orquídea Libre'
      );
    `);

    await queryRunner.query(`
      DELETE FROM emotional_goals;
    `);

    await queryRunner.query(`
      DELETE FROM emotion_processing_styles;
    `);
  }
}
