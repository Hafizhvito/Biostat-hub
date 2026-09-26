ALTER TABLE `downloads`
  ADD COLUMN `section_id` INTEGER NULL;

CREATE INDEX `downloads_section_id_idx` ON `downloads`(`section_id`);

ALTER TABLE `downloads`
  ADD CONSTRAINT `downloads_section_id_fkey`
  FOREIGN KEY (`section_id`) REFERENCES `sections`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
