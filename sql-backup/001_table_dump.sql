-- MySQL dump 10.13  Distrib 8.0.20, for Win64 (x86_64)
--
-- Host: localhost    Database: staff-share
-- ------------------------------------------------------
-- Server version	8.0.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `sheet`
--

DROP TABLE IF EXISTS `sheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sheet` (
  `id` char(36) NOT NULL,
  `title` varchar(45) NOT NULL,
  `subtitle` varchar(45) DEFAULT NULL,
  `composer` varchar(45) DEFAULT NULL,
  `genre` varchar(45) DEFAULT NULL,
  `keySignature` varchar(45) DEFAULT NULL,
  `data_path` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sheet`
--

LOCK TABLES `sheet` WRITE;
/*!40000 ALTER TABLE `sheet` DISABLE KEYS */;
INSERT INTO `sheet` VALUES ('13512770-e069-4675-b031-7802f5a33ee0','Testing','Testing','Tester','Choral','A#/Bb','13512770-e069-4675-b031-7802f5a33ee0.pdf',NULL,NULL,'Nana Ama Gibson'),('39b7134c-1883-47e0-82d6-e0fa85a22d4e','Testing','TEsting','Testing','Choral','A','39b7134c-1883-47e0-82d6-e0fa85a22d4e.pdf',NULL,NULL,'Akua Asiedua'),('3ae242dd-3901-42d8-a1f6-4d801ef7ab8c','Test','test','tester','Choral','A','3ae242dd-3901-42d8-a1f6-4d801ef7ab8c.pdf','2020-08-12 12:42:39',NULL,'Akua Asiedua'),('42907546-1b0f-4599-ba43-9c930e10354a','Testing','Testing','Tester','Choral','A','42907546-1b0f-4599-ba43-9c930e10354a.pdf',NULL,NULL,'Nana Ama Gibson'),('790a3ca8-5fa1-45ac-a3fb-9539fa7836e6','Testing','Testing','Testing','Classical','G','790a3ca8-5fa1-45ac-a3fb-9539fa7836e6.pdf',NULL,NULL,'Amponsem Kwabena'),('af84f6eb-ff75-443f-9de1-870f5d227d5b','Recent Tests','Testing','Tester','Jazz','B','af84f6eb-ff75-443f-9de1-870f5d227d5b.pdf',NULL,NULL,'Amponsem Kwabena'),('bfc971d6-1f0d-42d4-9ceb-24f5941ec3ee','Testing','Testing','Tester','Classical','A#/Bb','bfc971d6-1f0d-42d4-9ceb-24f5941ec3ee.pdf',NULL,NULL,'Nana Ama Gibson'),('f5f827e1-983c-4549-9966-b05e33f16787','Test','Test','Test','Choral','A','f5f827e1-983c-4549-9966-b05e33f16787.pdf','2020-08-12 14:20:55',NULL,'Akua Asiedua');
/*!40000 ALTER TABLE `sheet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `audio`
--

DROP TABLE IF EXISTS `audio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audio` (
  `id` char(36) NOT NULL,
  `part_name` varchar(45) NOT NULL,
  `data_path` varchar(45) NOT NULL,
  `uploaded_by` char(36) DEFAULT NULL,
  `sheet_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sheet_id` (`sheet_id`),
  CONSTRAINT `audio_ibfk_1` FOREIGN KEY (`sheet_id`) REFERENCES `sheet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audio`
--

LOCK TABLES `audio` WRITE;
/*!40000 ALTER TABLE `audio` DISABLE KEYS */;
INSERT INTO `audio` VALUES ('48c2a1e2-319d-453f-8d34-8fc100f967d9','Audio','48c2a1e2-319d-453f-8d34-8fc100f967d9.mp3','Amponsem Kwabena','790a3ca8-5fa1-45ac-a3fb-9539fa7836e6'),('5880174f-eb2e-4200-9f78-9d865b555f77','Audio 2','5880174f-eb2e-4200-9f78-9d865b555f77.mp3','Akua Asiedua','39b7134c-1883-47e0-82d6-e0fa85a22d4e'),('5a94ca77-e0d4-45ff-ae29-74c0a55a1961','Audio 1','5a94ca77-e0d4-45ff-ae29-74c0a55a1961.mp3','Akua Asiedua','39b7134c-1883-47e0-82d6-e0fa85a22d4e');
/*!40000 ALTER TABLE `audio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `likes`
--

DROP TABLE IF EXISTS `likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `likes` (
  `id` char(36) NOT NULL,
  `sheet_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sheet_id` (`sheet_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`sheet_id`) REFERENCES `sheet` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `likes`
--

LOCK TABLES `likes` WRITE;
/*!40000 ALTER TABLE `likes` DISABLE KEYS */;
INSERT INTO `likes` VALUES ('0f18e9dc-823c-4d4c-bf86-5b9c6910dd17','3ae242dd-3901-42d8-a1f6-4d801ef7ab8c','8845ba9c-7ed5-4cad-b771-91281e1d6a3f'),('27742f56-988a-475d-a0a7-d44ff79c862c','f5f827e1-983c-4549-9966-b05e33f16787','78b7fb67-ea9e-4df2-bed4-684c6c36d8bf'),('300556c2-1035-4002-851e-24aebbdeccc6','3ae242dd-3901-42d8-a1f6-4d801ef7ab8c','7288dfd9-aa4f-420c-9008-ee0ab8399af6'),('49cf234b-8619-444c-bbba-c2bd98df45d9','bfc971d6-1f0d-42d4-9ceb-24f5941ec3ee','05da422c-2ae6-4bcb-a483-a0476fc16264'),('79a61fd5-95ff-405f-8bdf-a13ee2072fdf','13512770-e069-4675-b031-7802f5a33ee0','05da422c-2ae6-4bcb-a483-a0476fc16264'),('7cd64213-186d-4a41-97e1-7a98b85f3b95','f5f827e1-983c-4549-9966-b05e33f16787','05da422c-2ae6-4bcb-a483-a0476fc16264'),('9037b06c-ab89-4d0d-bb46-9265c1d77a37','bfc971d6-1f0d-42d4-9ceb-24f5941ec3ee','78b7fb67-ea9e-4df2-bed4-684c6c36d8bf'),('c8e19186-b383-41ad-99da-612532e38f7e','13512770-e069-4675-b031-7802f5a33ee0','78b7fb67-ea9e-4df2-bed4-684c6c36d8bf'),('cb84ebcc-808a-4a93-babc-1d90430bc741','790a3ca8-5fa1-45ac-a3fb-9539fa7836e6','05da422c-2ae6-4bcb-a483-a0476fc16264'),('d4d76c09-20e9-4828-b090-9d1bd31c54b5','3ae242dd-3901-42d8-a1f6-4d801ef7ab8c','78b7fb67-ea9e-4df2-bed4-684c6c36d8bf'),('df26eaf1-74d8-4077-8655-6410c33573e1','39b7134c-1883-47e0-82d6-e0fa85a22d4e','78b7fb67-ea9e-4df2-bed4-684c6c36d8bf'),('ee831cf5-e6a1-4da3-b0c5-e4ad67c85c11','39b7134c-1883-47e0-82d6-e0fa85a22d4e','05da422c-2ae6-4bcb-a483-a0476fc16264');
/*!40000 ALTER TABLE `likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorites`
--

DROP TABLE IF EXISTS `favorites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favorites` (
  `id` char(36) NOT NULL,
  `sheet_id` char(36) NOT NULL,
  `user_id` char(36) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorites`
--

LOCK TABLES `favorites` WRITE;
/*!40000 ALTER TABLE `favorites` DISABLE KEYS */;
INSERT INTO `favorites` VALUES ('36b0c30c-da2d-4b1b-8ee8-708bc2318612','39b7134c-1883-47e0-82d6-e0fa85a22d4e','78b7fb67-ea9e-4df2-bed4-684c6c36d8bf'),('769ec2f8-4f2b-47dc-9789-51b6824b6cee','af84f6eb-ff75-443f-9de1-870f5d227d5b','05da422c-2ae6-4bcb-a483-a0476fc16264'),('7ab4527f-a024-4e61-b636-8df545dc0efa','790a3ca8-5fa1-45ac-a3fb-9539fa7836e6','05da422c-2ae6-4bcb-a483-a0476fc16264'),('84a35a88-652e-41ca-9a8b-d8670b37b515','13512770-e069-4675-b031-7802f5a33ee0','05da422c-2ae6-4bcb-a483-a0476fc16264'),('895d5be1-b7cb-4e5d-a454-8f61d46ddc79','39b7134c-1883-47e0-82d6-e0fa85a22d4e','05da422c-2ae6-4bcb-a483-a0476fc16264'),('c28e5a8d-fd2b-423f-add1-8676c5eac2b3','13512770-e069-4675-b031-7802f5a33ee0','7288dfd9-aa4f-420c-9008-ee0ab8399af6');
/*!40000 ALTER TABLE `favorites` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-08-12 16:27:43
