import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedEmotions1773356670957 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO emotions (id, name, icon)
      VALUES
      (uuid_generate_v4(), 'Neutral', '😐'),
      (uuid_generate_v4(), 'Feliz', '😊'),
      (uuid_generate_v4(), 'En calma', '😌'),
      (uuid_generate_v4(), 'Ansiedad', '😰'),
      (uuid_generate_v4(), 'Tristeza', '😢'),
      (uuid_generate_v4(), 'Frustración', '😤')
    `);

    await queryRunner.query(`
      INSERT INTO sub_emotions (id, name, icon, "emotionId")
      SELECT uuid_generate_v4(), sub.name, sub.icon, e.id
      FROM emotions e
      JOIN (
        VALUES
        ('Neutral','Indiferente','😐'),
        ('Neutral','Desconectado','😶'),
        ('Neutral','Apatía','🫥'),
        ('Neutral','Sin energía','😑'),
        ('Neutral','Reservado','🤐'),

        ('Feliz','Agradecido','🙏'),
        ('Feliz','Optimista','🌞'),
        ('Feliz','Motivado','💪'),
        ('Feliz','Orgulloso','🏆'),
        ('Feliz','Entusiasmado','🤩'),

        ('En calma','Relajado','🧘'),
        ('En calma','Seguro','🛡️'),
        ('En calma','Equilibrado','⚖️'),
        ('En calma','Confiado','🙂'),
        ('En calma','Centrado','🎯'),

        ('Ansiedad','Preocupado','😟'),
        ('Ansiedad','Inquieto','😬'),
        ('Ansiedad','Abrumado','😵'),
        ('Ansiedad','Tenso','😖'),
        ('Ansiedad','Nervioso','😣'),

        ('Tristeza','Solo','🥀'),
        ('Tristeza','Desanimado','😞'),
        ('Tristeza','Herido','💔'),
        ('Tristeza','Melancólico','🌧️'),
        ('Tristeza','Desesperanzado','😔'),

        ('Frustración','Irritado','😠'),
        ('Frustración','Impotente','😤'),
        ('Frustración','Molesto','😒'),
        ('Frustración','Decepcionado','😑'),
        ('Frustración','Agotado','😫')
      ) AS sub(emotion, name, icon)
      ON e.name = sub.emotion
    `);

    await queryRunner.query(`
      INSERT INTO emotion_causes (id, name, icon, "emotionId")
      SELECT uuid_generate_v4(), cause.name, cause.icon, e.id
      FROM emotions e
      JOIN (
        VALUES
        ('Neutral','Rutina diaria','📅'),
        ('Neutral','Falta de estímulo','🪫'),
        ('Neutral','Día normal','☁️'),
        ('Neutral','Cansancio leve','😴'),
        ('Neutral','Nada en particular','🤷'),

        ('Feliz','Logro personal','🏆'),
        ('Feliz','Tiempo con amigos','👫'),
        ('Feliz','Buenas noticias','📰'),
        ('Feliz','Actividad favorita','🎮'),
        ('Feliz','Agradecimiento','🙏'),

        ('En calma','Meditación','🧘'),
        ('En calma','Tiempo en naturaleza','🌿'),
        ('En calma','Descanso','🛏️'),
        ('En calma','Orden personal','📦'),
        ('En calma','Momento tranquilo','🌙'),

        ('Ansiedad','Exceso de trabajo','💼'),
        ('Ansiedad','Preocupación futura','🔮'),
        ('Ansiedad','Problemas financieros','💸'),
        ('Ansiedad','Falta de control','🌀'),
        ('Ansiedad','Presión social','👥'),

        ('Tristeza','Discusión','💔'),
        ('Tristeza','Pérdida','🕊️'),
        ('Tristeza','Soledad','🏠'),
        ('Tristeza','Recuerdo doloroso','📷'),
        ('Tristeza','Cansancio emocional','🫠'),

        ('Frustración','Objetivo no logrado','🎯'),
        ('Frustración','Problema técnico','💻'),
        ('Frustración','Falta de tiempo','⏰'),
        ('Frustración','Malentendido','🗣️'),
        ('Frustración','Bloqueo personal','🚧')
      ) AS cause(emotion, name, icon)
      ON e.name = cause.emotion
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM emotion_causes`);
    await queryRunner.query(`DELETE FROM sub_emotions`);
    await queryRunner.query(`DELETE FROM emotions`);
  }
}
