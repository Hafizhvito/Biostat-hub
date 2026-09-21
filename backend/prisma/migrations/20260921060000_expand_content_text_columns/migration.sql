ALTER TABLE `sections`
  MODIFY `description` TEXT NOT NULL;

ALTER TABLE `videos`
  MODIFY `description` TEXT NOT NULL;

ALTER TABLE `site_settings`
  MODIFY `hero_description` TEXT NOT NULL;

ALTER TABLE `glossary`
  MODIFY `definition` TEXT NOT NULL,
  MODIFY `example` TEXT NULL;

ALTER TABLE `downloads`
  MODIFY `description` TEXT NOT NULL;

ALTER TABLE `wizard_images`
  MODIFY `description` TEXT NOT NULL;
