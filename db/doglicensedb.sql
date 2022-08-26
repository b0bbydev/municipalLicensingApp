-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 26, 2022 at 03:42 PM
-- Server version: 5.7.36
-- PHP Version: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `doglicensedb`
--

-- --------------------------------------------------------

--
-- Table structure for table `additionalowners`
--

DROP TABLE IF EXISTS `additionalowners`;
CREATE TABLE IF NOT EXISTS `additionalowners` (
  `additionalOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `homePhone` varchar(15) DEFAULT NULL,
  `cellPhone` varchar(15) DEFAULT NULL,
  `workPhone` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `ownerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`additionalOwnerID`),
  KEY `ownerID` (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `addressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `poBoxAptRR` varchar(25) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `ownerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`addressID`),
  KEY `ownerID` (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `addresses`
--
DROP TRIGGER IF EXISTS `addressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `addressHistoryInsert` AFTER INSERT ON `addresses` FOR EACH ROW INSERT INTO addressHistory
 SET action = 'insert',
     streetNumber = NEW.streetNumber,
     streetName = NEW.streetName,
     poBoxAptRR = NEW.poBoxAptRR,
     town = NEW.town,
     postalCode = NEW.postalCode,
     lastModified = NOW(),
     ownerID = NEW.ownerID,
     addressID = NEW.addressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `addressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `addressHistoryUpdate` AFTER UPDATE ON `addresses` FOR EACH ROW INSERT INTO addressHistory
 SET action = 'update',
     streetNumber = NEW.streetNumber,
     streetName = NEW.streetName,
     poBoxAptRR = NEW.poBoxAptRR,
     town = NEW.town,
     postalCode = NEW.postalCode,
     lastModified = NOW(),
     ownerID = NEW.ownerID,
     addressID = NEW.addressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `addresshistory`
--

DROP TABLE IF EXISTS `addresshistory`;
CREATE TABLE IF NOT EXISTS `addresshistory` (
  `addressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(15) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(40) DEFAULT NULL,
  `poBoxAptRR` varchar(25) DEFAULT NULL,
  `town` varchar(40) DEFAULT NULL,
  `postalCode` varchar(30) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `ownerID` int(11) NOT NULL,
  `addressID` int(11) NOT NULL,
  PRIMARY KEY (`addressHistoryID`),
  KEY `FK_ownerID` (`ownerID`),
  KEY `FK_addressID` (`addressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `businessaddresses`
--

DROP TABLE IF EXISTS `businessaddresses`;
CREATE TABLE IF NOT EXISTS `businessaddresses` (
  `businessAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `poBoxAptRR` varchar(25) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `businessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`businessAddressID`),
  KEY `businessID` (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `businessaddresses`
--
DROP TRIGGER IF EXISTS `businessAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `businessAddressHistoryInsert` AFTER INSERT ON `businessaddresses` FOR EACH ROW INSERT INTO businessesAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 poBoxAptRR = NEW.poBoxAptRR,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     businessID = NEW.businessID,
     businessAddressID = NEW.businessAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `businessAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `businessAddressHistoryUpdate` AFTER UPDATE ON `businessaddresses` FOR EACH ROW INSERT INTO businessesAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
     poBoxAptRR = NEW.poBoxAptRR,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     businessID = NEW.businessID,
     businessAddressID = NEW.businessAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
CREATE TABLE IF NOT EXISTS `businesses` (
  `businessID` int(11) NOT NULL AUTO_INCREMENT,
  `businessName` varchar(50) DEFAULT NULL,
  `ownerName` varchar(50) DEFAULT NULL,
  `contactName` varchar(50) DEFAULT NULL,
  `contactPhone` varchar(15) DEFAULT NULL,
  `licenseNumber` varchar(15) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `healthInspection` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  `feePaid` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `businesses`
--
DROP TRIGGER IF EXISTS `adultEntertainmentBusinessHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `adultEntertainmentBusinessHistoryInsert` AFTER INSERT ON `businesses` FOR EACH ROW INSERT INTO businessHistory
 SET action = 'insert',
     businessName = NEW.businessName,
     ownerName = NEW.ownerName,
     contactName = NEW.contactName,
     contactPhone = NEW.contactPhone,
     licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
     certificateOfInsurance = NEW.certificateOfInsurance,
     photoID = NEW.photoID,
     healthInspection = NEW.healthInspection,
     zoningClearance = NEW.zoningClearance,
     feePaid = NEW.feePaid,
     notes = NEW.notes,
     lastModified = NOW(),
     businessID = NEW.businessID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `adultEntertainmentBusinessHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `adultEntertainmentBusinessHistoryUpdate` AFTER UPDATE ON `businesses` FOR EACH ROW INSERT INTO businessHistory
 SET action = 'update',
     businessName = NEW.businessName,
     ownerName = NEW.ownerName,
     contactName = NEW.contactName,
     contactPhone = NEW.contactPhone,
     licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
     certificateOfInsurance = NEW.certificateOfInsurance,
     photoID = NEW.photoID,
     healthInspection = NEW.healthInspection,
     zoningClearance = NEW.zoningClearance,
     feePaid = NEW.feePaid,
     notes = NEW.notes,
     lastModified = NOW(),
     businessID = NEW.businessID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `businessesaddresshistory`
--

DROP TABLE IF EXISTS `businessesaddresshistory`;
CREATE TABLE IF NOT EXISTS `businessesaddresshistory` (
  `businessAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `poBoxAptRR` varchar(25) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `businessAddressID` int(11) DEFAULT NULL,
  `businessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`businessAddressHistoryID`),
  KEY `businessAddressID` (`businessAddressID`),
  KEY `businessID` (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `businesshistory`
--

DROP TABLE IF EXISTS `businesshistory`;
CREATE TABLE IF NOT EXISTS `businesshistory` (
  `businessHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `businessName` varchar(50) DEFAULT NULL,
  `ownerName` varchar(50) DEFAULT NULL,
  `contactName` varchar(50) DEFAULT NULL,
  `contactPhone` varchar(15) DEFAULT NULL,
  `licenseNumber` varchar(15) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `healthInspection` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  `feePaid` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `businessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`businessHistoryID`),
  KEY `businessID` (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `doghistory`
--

DROP TABLE IF EXISTS `doghistory`;
CREATE TABLE IF NOT EXISTS `doghistory` (
  `dogHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `tagNumber` varchar(25) DEFAULT NULL,
  `dogName` varchar(30) DEFAULT NULL,
  `breed` varchar(25) DEFAULT NULL,
  `colour` varchar(25) DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `designation` varchar(20) DEFAULT NULL,
  `spade` varchar(20) DEFAULT NULL,
  `rabiesTagNumber` varchar(25) DEFAULT NULL,
  `rabiesExpiry` date DEFAULT NULL,
  `vetOffice` varchar(50) DEFAULT NULL,
  `tagRequired` varchar(30) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `vendor` varchar(30) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `dogID` int(11) DEFAULT NULL,
  `ownerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`dogHistoryID`),
  KEY `ownerID` (`ownerID`),
  KEY `dogID` (`dogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `dogs`
--

DROP TABLE IF EXISTS `dogs`;
CREATE TABLE IF NOT EXISTS `dogs` (
  `dogID` int(11) NOT NULL AUTO_INCREMENT,
  `tagNumber` varchar(25) DEFAULT NULL,
  `dogName` varchar(30) DEFAULT NULL,
  `breed` varchar(25) DEFAULT NULL,
  `colour` varchar(25) DEFAULT NULL,
  `gender` enum('M','F') DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `designation` varchar(20) DEFAULT NULL,
  `spade` varchar(20) DEFAULT NULL,
  `rabiesTagNumber` varchar(25) DEFAULT NULL,
  `rabiesExpiry` date DEFAULT NULL,
  `vetOffice` varchar(50) DEFAULT NULL,
  `tagRequired` varchar(30) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `vendor` varchar(30) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `ownerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`dogID`),
  KEY `ownerID` (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `dogs`
--
DROP TRIGGER IF EXISTS `dogHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `dogHistoryInsert` AFTER INSERT ON `dogs` FOR EACH ROW INSERT INTO dogHistory
 SET action = 'insert',
	 tagNumber = NEW.tagNumber,
     dogName = NEW.dogName,
     breed = NEW.breed,
     colour = NEW.colour,
     gender = NEW.gender,
     dateOfBirth = NEW.dateOfBirth,
     designation = NEW.designation,
     spade = NEW.spade,
     rabiesTagNumber = NEW.rabiesTagNumber,
     rabiesExpiry = NEW.rabiesExpiry,
     vetOffice = NEW.vetOffice,
     tagRequired = NEW.tagRequired,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     vendor = NEW.vendor,
     notes = NEW.notes,
     lastModified = NOW(),
     dogID = NEW.dogID,
     ownerID = NEW.ownerID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `dogHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `dogHistoryUpdate` AFTER UPDATE ON `dogs` FOR EACH ROW INSERT INTO dogHistory
 SET action = 'update',
	 tagNumber = NEW.tagNumber,
     dogName = NEW.dogName,
     breed = NEW.breed,
     colour = NEW.colour,
     gender = NEW.gender,
     dateOfBirth = NEW.dateOfBirth,
     designation = NEW.designation,
     spade = NEW.spade,
     rabiesTagNumber = NEW.rabiesTagNumber,
     rabiesExpiry = NEW.rabiesExpiry,
     vetOffice = NEW.vetOffice,
     tagRequired = NEW.tagRequired,
	 issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     vendor = NEW.vendor,
     notes = NEW.notes,
     lastModified = NOW(),
     dogID = NEW.dogID,
     ownerID = NEW.ownerID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `tagNumberHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `tagNumberHistoryInsert` AFTER INSERT ON `dogs` FOR EACH ROW INSERT INTO tagNumberHistory
 SET action = 'insert',
     tagNumber = NEW.tagNumber,
     dogName = NEW.dogName,
     lastModified = NOW(),
     dogID = NEW.dogID,
     ownerID = NEW.ownerID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `tagNumberHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `tagNumberHistoryUpdate` AFTER UPDATE ON `dogs` FOR EACH ROW BEGIN
   IF !(NEW.tagNumber <=> OLD.tagNumber) THEN
       INSERT INTO tagNumberHistory
 SET action = 'update',
	 tagNumber = NEW.tagNumber,
     dogName = NEW.dogName,
     lastModified = NOW(),
     dogID = NEW.dogID,
     ownerID = NEW.ownerID;
   END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinaddresses`
--

DROP TABLE IF EXISTS `donationbinaddresses`;
CREATE TABLE IF NOT EXISTS `donationbinaddresses` (
  `donationBinAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `donationBinID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinAddressID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `donationbinaddresses`
--
DROP TRIGGER IF EXISTS `donationBinAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `donationBinAddressHistoryInsert` AFTER INSERT ON `donationbinaddresses` FOR EACH ROW INSERT INTO donationBinAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     donationBinID = NEW.donationBinID,
     donationBinAddressID = NEW.donationBinAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `donationBinAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `donationBinAddressHistoryUpdate` AFTER UPDATE ON `donationbinaddresses` FOR EACH ROW INSERT INTO donationBinAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     donationBinID = NEW.donationBinID,
     donationBinAddressID = NEW.donationBinAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinaddresshistory`
--

DROP TABLE IF EXISTS `donationbinaddresshistory`;
CREATE TABLE IF NOT EXISTS `donationbinaddresshistory` (
  `donationBinAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinID` int(11) DEFAULT NULL,
  `donationBinAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinAddressHistoryID`),
  KEY `donationBinID` (`donationBinID`),
  KEY `donationBinAddressID` (`donationBinAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbincharities`
--

DROP TABLE IF EXISTS `donationbincharities`;
CREATE TABLE IF NOT EXISTS `donationbincharities` (
  `donationBinCharityID` int(11) NOT NULL AUTO_INCREMENT,
  `charityName` varchar(50) DEFAULT NULL,
  `registrationNumber` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `organizationType` enum('Charity','Not-For-Profit','For-Profit') DEFAULT NULL,
  `donationBinID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinCharityID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinhistory`
--

DROP TABLE IF EXISTS `donationbinhistory`;
CREATE TABLE IF NOT EXISTS `donationbinhistory` (
  `donationBinHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `licenseNumber` varchar(15) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `itemsCollected` varchar(255) DEFAULT NULL,
  `pickupSchedule` varchar(255) DEFAULT NULL,
  `colour` varchar(25) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinHistoryID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinoperatoraddresses`
--

DROP TABLE IF EXISTS `donationbinoperatoraddresses`;
CREATE TABLE IF NOT EXISTS `donationbinoperatoraddresses` (
  `donationBinOperatorAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `donationBinOperatorID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinOperatorAddressID`),
  KEY `donationBinOperatorID` (`donationBinOperatorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `donationbinoperatoraddresses`
--
DROP TRIGGER IF EXISTS `donationBinOperatorAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `donationBinOperatorAddressHistoryInsert` AFTER INSERT ON `donationbinoperatoraddresses` FOR EACH ROW INSERT INTO donationBinOperatorAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     donationBinOperatorID = NEW.donationBinOperatorID,
     donationBinOperatorAddressID = NEW.donationBinOperatorAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `donationBinOperatorAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `donationBinOperatorAddressHistoryUpdate` AFTER UPDATE ON `donationbinoperatoraddresses` FOR EACH ROW INSERT INTO donationBinOperatorAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     donationBinOperatorID = NEW.donationBinOperatorID,
     donationBinOperatorAddressID = NEW.donationBinOperatorAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinoperatoraddresshistory`
--

DROP TABLE IF EXISTS `donationbinoperatoraddresshistory`;
CREATE TABLE IF NOT EXISTS `donationbinoperatoraddresshistory` (
  `donationBinOperatorAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinOperatorID` int(11) DEFAULT NULL,
  `donationBinOperatorAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinOperatorAddressHistoryID`),
  KEY `donationBinOperatorID` (`donationBinOperatorID`),
  KEY `donationBinOperatorAddressID` (`donationBinOperatorAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinoperators`
--

DROP TABLE IF EXISTS `donationbinoperators`;
CREATE TABLE IF NOT EXISTS `donationbinoperators` (
  `donationBinOperatorID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(25) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `charityInformation` enum('Yes','No') DEFAULT NULL,
  `sitePlan` enum('Yes','No') DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') DEFAULT NULL,
  `ownerConsent` enum('Yes','No') DEFAULT NULL,
  `donationBinID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinOperatorID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinpropertyowneraddresses`
--

DROP TABLE IF EXISTS `donationbinpropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `donationbinpropertyowneraddresses` (
  `donationBinPropertyOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `donationBinPropertyOwnerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinPropertyOwnerAddressID`),
  KEY `donationBinPropertyOwnerID` (`donationBinPropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `donationbinpropertyowneraddresses`
--
DROP TRIGGER IF EXISTS `donationBinPropertyOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `donationBinPropertyOwnerAddressHistoryInsert` AFTER INSERT ON `donationbinpropertyowneraddresses` FOR EACH ROW INSERT INTO donationBinPropertyOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     donationBinPropertyOwnerID = NEW.donationBinPropertyOwnerID,
     donationBinPropertyOwnerAddressID = NEW.donationBinPropertyOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `donationBinPropertyOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `donationBinPropertyOwnerAddressHistoryUpdate` AFTER UPDATE ON `donationbinpropertyowneraddresses` FOR EACH ROW INSERT INTO donationBinPropertyOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     donationBinPropertyOwnerID = NEW.donationBinPropertyOwnerID,
     donationBinPropertyOwnerAddressID = NEW.donationBinPropertyOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinpropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `donationbinpropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `donationbinpropertyowneraddresshistory` (
  `donationBinPropertyOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinPropertyOwnerID` int(11) DEFAULT NULL,
  `donationBinPropertyOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinPropertyOwnerAddressHistoryID`),
  KEY `donationBinPropertyOwnerID` (`donationBinPropertyOwnerID`),
  KEY `donationBinPropertyOwnerAddressID` (`donationBinPropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinpropertyowners`
--

DROP TABLE IF EXISTS `donationbinpropertyowners`;
CREATE TABLE IF NOT EXISTS `donationbinpropertyowners` (
  `donationBinPropertyOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `donationBinID` int(11) DEFAULT NULL,
  PRIMARY KEY (`donationBinPropertyOwnerID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `donationbins`
--

DROP TABLE IF EXISTS `donationbins`;
CREATE TABLE IF NOT EXISTS `donationbins` (
  `donationBinID` int(11) NOT NULL AUTO_INCREMENT,
  `licenseNumber` varchar(15) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `itemsCollected` varchar(255) DEFAULT NULL,
  `pickupSchedule` varchar(255) DEFAULT NULL,
  `colour` varchar(25) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `donationbins`
--
DROP TRIGGER IF EXISTS `donationBinHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `donationBinHistoryInsert` AFTER INSERT ON `donationbins` FOR EACH ROW INSERT INTO donationBinHistory
 SET action = 'insert',
     licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     itemsCollected = NEW.itemsCollected,
     pickupSchedule = NEW.pickupSchedule,
     colour = NEW.colour,
     material = NEW.material,
     notes = NEW.notes,
     lastModified = NOW(),
     donationBinID = NEW.donationBinID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `donationBinHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `donationBinHistoryUpdate` AFTER UPDATE ON `donationbins` FOR EACH ROW INSERT INTO donationBinHistory
 SET action = 'update',
     licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     itemsCollected = NEW.itemsCollected,
     pickupSchedule = NEW.pickupSchedule,
     colour = NEW.colour,
     material = NEW.material,
     notes = NEW.notes,
     lastModified = NOW(),
     donationBinID = NEW.donationBinID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `dropdownforms`
--

DROP TABLE IF EXISTS `dropdownforms`;
CREATE TABLE IF NOT EXISTS `dropdownforms` (
  `dropdownFormID` int(11) NOT NULL AUTO_INCREMENT,
  `formName` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`dropdownFormID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `dropdowns`
--

DROP TABLE IF EXISTS `dropdowns`;
CREATE TABLE IF NOT EXISTS `dropdowns` (
  `dropdownID` int(11) NOT NULL AUTO_INCREMENT,
  `dropdownTitle` varchar(50) DEFAULT NULL,
  `dropdownValue` varchar(50) DEFAULT NULL,
  `isDisabled` tinyint(1) NOT NULL,
  `dropdownFormID` int(11) DEFAULT NULL,
  PRIMARY KEY (`dropdownID`),
  KEY `dropdownFormID` (`dropdownFormID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `guidelinehistory`
--

DROP TABLE IF EXISTS `guidelinehistory`;
CREATE TABLE IF NOT EXISTS `guidelinehistory` (
  `guidelineHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `guidelineNumber` varchar(30) DEFAULT NULL,
  `guidelineName` varchar(80) DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `authority` varchar(30) DEFAULT NULL,
  `administrator` varchar(30) DEFAULT NULL,
  `legislationRequired` varchar(5) DEFAULT NULL,
  `fileHoldURL` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `policyID` int(11) DEFAULT NULL,
  `guidelineID` int(11) DEFAULT NULL,
  PRIMARY KEY (`guidelineHistoryID`),
  KEY `policyID` (`policyID`),
  KEY `guidelineID` (`guidelineID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `guidelines`
--

DROP TABLE IF EXISTS `guidelines`;
CREATE TABLE IF NOT EXISTS `guidelines` (
  `guidelineID` int(11) NOT NULL AUTO_INCREMENT,
  `guidelineNumber` varchar(30) DEFAULT NULL,
  `guidelineName` varchar(80) DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `authority` varchar(30) DEFAULT NULL,
  `administrator` varchar(30) DEFAULT NULL,
  `legislationRequired` varchar(5) DEFAULT NULL,
  `fileHoldURL` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policyID` int(11) DEFAULT NULL,
  PRIMARY KEY (`guidelineID`),
  KEY `policyID` (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `guidelines`
--
DROP TRIGGER IF EXISTS `guidelineHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `guidelineHistoryInsert` AFTER INSERT ON `guidelines` FOR EACH ROW INSERT INTO guidelineHistory
 SET action = 'insert',
     guidelineNumber = NEW.guidelineNumber,
     guidelineName = NEW.guidelineName,
     dateApproved = NEW.dateApproved,
     lastReviewDate = NEW.lastReviewDate,
     scheduledReviewDate = NEW.scheduledReviewDate,
     dateAmended = NEW.dateAmended,
     status = NEW.status,
     category = NEW.category,
     division = NEW.division,
     authority = NEW.authority,
     administrator = NEW.administrator,
     legislationRequired = NEW.legislationRequired,
     fileholdURL = NEW.fileholdURL,
     notes = NEW.notes,
     lastModified = NOW(),
	 guidelineID = NEW.guidelineID,
     policyID = NEW.policyID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `guidelineHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `guidelineHistoryUpdate` AFTER UPDATE ON `guidelines` FOR EACH ROW INSERT INTO guidelineHistory
 SET action = 'update',
     guidelineNumber = NEW.guidelineNumber,
     guidelineName = NEW.guidelineName,
     dateApproved = NEW.dateApproved,
     lastReviewDate = NEW.lastReviewDate,
     scheduledReviewDate = NEW.scheduledReviewDate,
     dateAmended = NEW.dateAmended,
     status = NEW.status,
     category = NEW.category,
     division = NEW.division,
     authority = NEW.authority,
     administrator = NEW.administrator,
     legislationRequired = NEW.legislationRequired,
     fileholdURL = NEW.fileholdURL,
     notes = NEW.notes,
     lastModified = NOW(),
	 guidelineID = NEW.guidelineID,
     policyID = NEW.policyID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerapplicantaddresses`
--

DROP TABLE IF EXISTS `hawkerpeddlerapplicantaddresses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerapplicantaddresses` (
  `hawkerPeddlerApplicantAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `hawkerPeddlerApplicantID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerApplicantAddressID`),
  KEY `hawkerPeddlerApplicantID` (`hawkerPeddlerApplicantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `hawkerpeddlerapplicantaddresses`
--
DROP TRIGGER IF EXISTS `hawkerPeddlerApplicantAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerApplicantAddressHistoryInsert` AFTER INSERT ON `hawkerpeddlerapplicantaddresses` FOR EACH ROW INSERT INTO hawkerPeddlerApplicantAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     hawkerPeddlerApplicantID = NEW.hawkerPeddlerApplicantID,
     hawkerPeddlerApplicantAddressID = NEW.hawkerPeddlerApplicantAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `hawkerPeddlerApplicantAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerApplicantAddressHistoryUpdate` AFTER UPDATE ON `hawkerpeddlerapplicantaddresses` FOR EACH ROW INSERT INTO hawkerPeddlerApplicantAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     hawkerPeddlerApplicantID = NEW.hawkerPeddlerApplicantID,
     hawkerPeddlerApplicantAddressID = NEW.hawkerPeddlerApplicantAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerapplicantaddresshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerapplicantaddresshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerapplicantaddresshistory` (
  `hawkerPeddlerApplicantAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerApplicantID` int(11) DEFAULT NULL,
  `hawkerPeddlerApplicantAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerApplicantAddressHistoryID`),
  KEY `hawkerPeddlerApplicantID` (`hawkerPeddlerApplicantID`),
  KEY `hawkerPeddlerApplicantAddressID` (`hawkerPeddlerApplicantAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerapplicants`
--

DROP TABLE IF EXISTS `hawkerpeddlerapplicants`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerapplicants` (
  `hawkerPeddlerApplicantID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `hawkerPeddlerBusinessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerApplicantID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `hawkerpeddlerapplicants`
--
DROP TRIGGER IF EXISTS `hawkerPeddlerOperatorHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerOperatorHistoryInsert` AFTER INSERT ON `hawkerpeddlerapplicants` FOR EACH ROW INSERT INTO hawkerPeddlerOperatorHistory
 SET action = 'insert',
     firstName = NEW.firstName,
     lastName = NEW.lastName,
     phoneNumber = NEW.phoneNumber,
     email = NEW.email,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     licenseNumber = NEW.licenseNumber,
     lastModified = NOW(),
     hawkerPeddlerApplicantID = NEW.hawkerPeddlerApplicantID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `hawkerPeddlerOperatorHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerOperatorHistoryUpdate` AFTER UPDATE ON `hawkerpeddlerapplicants` FOR EACH ROW INSERT INTO hawkerPeddlerOperatorHistory
 SET action = 'update',
     firstName = NEW.firstName,
     lastName = NEW.lastName,
     phoneNumber = NEW.phoneNumber,
     email = NEW.email,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     licenseNumber = NEW.licenseNumber,
     lastModified = NOW(),
     hawkerPeddlerApplicantID = NEW.hawkerPeddlerApplicantID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinessaddresses`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinessaddresses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinessaddresses` (
  `hawkerPeddlerBusinessAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `hawkerPeddlerBusinessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessAddressID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `hawkerpeddlerbusinessaddresses`
--
DROP TRIGGER IF EXISTS `hawkerPeddlerBusinessAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerBusinessAddressHistoryInsert` AFTER INSERT ON `hawkerpeddlerbusinessaddresses` FOR EACH ROW INSERT INTO hawkerPeddlerBusinessAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     hawkerPeddlerBusinessID = NEW.hawkerPeddlerBusinessID,
     hawkerPeddlerBusinessAddressID = NEW.hawkerPeddlerBusinessAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `hawkerPeddlerBusinessAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerBusinessAddressHistoryUpdate` AFTER UPDATE ON `hawkerpeddlerbusinessaddresses` FOR EACH ROW INSERT INTO hawkerPeddlerBusinessAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     hawkerPeddlerBusinessID = NEW.hawkerPeddlerBusinessID,
     hawkerPeddlerBusinessAddressID = NEW.hawkerPeddlerBusinessAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinessaddresshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinessaddresshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinessaddresshistory` (
  `hawkerPeddlerBusinessAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerBusinessID` int(11) DEFAULT NULL,
  `hawkerPeddlerBusinessAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessAddressHistoryID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`),
  KEY `hawkerPeddlerBusinessAddressID` (`hawkerPeddlerBusinessAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinesses`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinesses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinesses` (
  `hawkerPeddlerBusinessID` int(11) NOT NULL AUTO_INCREMENT,
  `businessName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `itemsForSale` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `sitePlan` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddleroperatorhistory`
--

DROP TABLE IF EXISTS `hawkerpeddleroperatorhistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddleroperatorhistory` (
  `hawkerPeddlerOperatorHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerApplicantID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerOperatorHistoryID`),
  KEY `hawkerPeddlerApplicantID` (`hawkerPeddlerApplicantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerpropertyowneraddresses`
--

DROP TABLE IF EXISTS `hawkerpeddlerpropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerpropertyowneraddresses` (
  `hawkerPeddlerPropertyOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `hawkerPeddlerPropertyOwnerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerPropertyOwnerAddressID`),
  KEY `hawkerPeddlerPropertyOwnerID` (`hawkerPeddlerPropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `hawkerpeddlerpropertyowneraddresses`
--
DROP TRIGGER IF EXISTS `hawkerPeddlerPropertyOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerPropertyOwnerAddressHistoryInsert` AFTER INSERT ON `hawkerpeddlerpropertyowneraddresses` FOR EACH ROW INSERT INTO hawkerPeddlerPropertyOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     hawkerPeddlerPropertyOwnerID = NEW.hawkerPeddlerPropertyOwnerID,
     hawkerPeddlerPropertyOwnerAddressID = NEW.hawkerPeddlerPropertyOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `hawkerPeddlerPropertyOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `hawkerPeddlerPropertyOwnerAddressHistoryUpdate` AFTER UPDATE ON `hawkerpeddlerpropertyowneraddresses` FOR EACH ROW INSERT INTO hawkerPeddlerPropertyOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     hawkerPeddlerPropertyOwnerID = NEW.hawkerPeddlerPropertyOwnerID,
     hawkerPeddlerPropertyOwnerAddressID = NEW.hawkerPeddlerPropertyOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerpropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerpropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerpropertyowneraddresshistory` (
  `hawkerPeddlerPropertyOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerPropertyOwnerID` int(11) DEFAULT NULL,
  `hawkerPeddlerPropertyOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerPropertyOwnerAddressHistoryID`),
  KEY `hawkerPeddlerPropertyOwnerID` (`hawkerPeddlerPropertyOwnerID`),
  KEY `hawkerPeddlerPropertyOwnerAddressID` (`hawkerPeddlerPropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerpropertyowners`
--

DROP TABLE IF EXISTS `hawkerpeddlerpropertyowners`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerpropertyowners` (
  `hawkerPeddlerPropertyOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `hawkerPeddlerBusinessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerPropertyOwnerID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kenneladdresses`
--

DROP TABLE IF EXISTS `kenneladdresses`;
CREATE TABLE IF NOT EXISTS `kenneladdresses` (
  `kennelAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `kennelID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelAddressID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `kenneladdresses`
--
DROP TRIGGER IF EXISTS `kennelAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `kennelAddressHistoryInsert` AFTER INSERT ON `kenneladdresses` FOR EACH ROW INSERT INTO kennelAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     kennelID = NEW.kennelID,
     kennelAddressID = NEW.kennelAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `kennelAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `kennelAddressHistoryUpdate` AFTER UPDATE ON `kenneladdresses` FOR EACH ROW INSERT INTO kennelAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     kennelID = NEW.kennelID,
     kennelAddressID = NEW.kennelAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `kenneladdresshistory`
--

DROP TABLE IF EXISTS `kenneladdresshistory`;
CREATE TABLE IF NOT EXISTS `kenneladdresshistory` (
  `kennelAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelID` int(11) DEFAULT NULL,
  `kennelAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelAddressHistoryID`),
  KEY `kennelID` (`kennelID`),
  KEY `kennelAddressID` (`kennelAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kennelhistory`
--

DROP TABLE IF EXISTS `kennelhistory`;
CREATE TABLE IF NOT EXISTS `kennelhistory` (
  `kennelHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `kennelName` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policeCheck` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  `acoInspection` enum('Yes','No') DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelHistoryID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kennelowneraddresses`
--

DROP TABLE IF EXISTS `kennelowneraddresses`;
CREATE TABLE IF NOT EXISTS `kennelowneraddresses` (
  `kennelOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `kennelOwnerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelOwnerAddressID`),
  KEY `kennelOwnerID` (`kennelOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `kennelowneraddresses`
--
DROP TRIGGER IF EXISTS `kennelOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `kennelOwnerAddressHistoryInsert` AFTER INSERT ON `kennelowneraddresses` FOR EACH ROW INSERT INTO kennelOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     kennelOwnerID = NEW.kennelOwnerID,
     kennelOwnerAddressID = NEW.kennelOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `kennelOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `kennelOwnerAddressHistoryUpdate` AFTER UPDATE ON `kennelowneraddresses` FOR EACH ROW INSERT INTO kennelOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     kennelOwnerID = NEW.kennelOwnerID,
     kennelOwnerAddressID = NEW.kennelOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `kennelowneraddresshistory`
--

DROP TABLE IF EXISTS `kennelowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `kennelowneraddresshistory` (
  `kennelOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelOwnerID` int(11) DEFAULT NULL,
  `kennelOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelOwnerAddressHistoryID`),
  KEY `kennelOwnerID` (`kennelOwnerID`),
  KEY `kennelOwnerAddressID` (`kennelOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kennelowners`
--

DROP TABLE IF EXISTS `kennelowners`;
CREATE TABLE IF NOT EXISTS `kennelowners` (
  `kennelOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `kennelID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelOwnerID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kennelpropertyowneraddresses`
--

DROP TABLE IF EXISTS `kennelpropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `kennelpropertyowneraddresses` (
  `kennelPropertyOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `kennelPropertyOwnerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelPropertyOwnerAddressID`),
  KEY `kennelPropertyOwnerID` (`kennelPropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `kennelpropertyowneraddresses`
--
DROP TRIGGER IF EXISTS `kennelPropertyOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `kennelPropertyOwnerAddressHistoryInsert` AFTER INSERT ON `kennelpropertyowneraddresses` FOR EACH ROW INSERT INTO kennelPropertyOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     kennelPropertyOwnerID = NEW.kennelPropertyOwnerID,
     kennelPropertyOwnerAddressID = NEW.kennelPropertyOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `kennelPropertyOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `kennelPropertyOwnerAddressHistoryUpdate` AFTER UPDATE ON `kennelpropertyowneraddresses` FOR EACH ROW INSERT INTO kennelPropertyOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     kennelPropertyOwnerID = NEW.kennelPropertyOwnerID,
     kennelPropertyOwnerAddressID = NEW.kennelPropertyOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `kennelpropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `kennelpropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `kennelpropertyowneraddresshistory` (
  `kennelPropertyOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelPropertyOwnerID` int(11) DEFAULT NULL,
  `kennelPropertyOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelPropertyOwnerAddressHistoryID`),
  KEY `kennelPropertyOwnerID` (`kennelPropertyOwnerID`),
  KEY `kennelPropertyOwnerAddressID` (`kennelPropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kennelpropertyowners`
--

DROP TABLE IF EXISTS `kennelpropertyowners`;
CREATE TABLE IF NOT EXISTS `kennelpropertyowners` (
  `kennelPropertyOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `kennelID` int(11) DEFAULT NULL,
  PRIMARY KEY (`kennelPropertyOwnerID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `kennels`
--

DROP TABLE IF EXISTS `kennels`;
CREATE TABLE IF NOT EXISTS `kennels` (
  `kennelID` int(11) NOT NULL AUTO_INCREMENT,
  `kennelName` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policeCheck` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  `acoInspection` enum('Yes','No') DEFAULT NULL,
  PRIMARY KEY (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `kennels`
--
DROP TRIGGER IF EXISTS `kennelHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `kennelHistoryInsert` AFTER INSERT ON `kennels` FOR EACH ROW INSERT INTO kennelHistory
 SET action = 'insert',
     kennelName = NEW.kennelName,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     licenseNumber = NEW.licenseNumber,
     phoneNumber = NEW.phoneNumber,
     email = NEW.email,
     notes = NEW.notes,
     policeCheck = NEW.policeCheck,
     photoID = NEW.photoID,
     zoningClearance = NEW.zoningClearance,
     acoInspection = NEW.acoInspection,
     lastModified = NOW(),
     kennelID = NEW.kennelID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `kennelHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `kennelHistoryUpdate` AFTER UPDATE ON `kennels` FOR EACH ROW INSERT INTO kennelHistory
 SET action = 'update',
     kennelName = NEW.kennelName,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     licenseNumber = NEW.licenseNumber,
     phoneNumber = NEW.phoneNumber,
     email = NEW.email,
     notes = NEW.notes,
     policeCheck = NEW.policeCheck,
     photoID = NEW.photoID,
     zoningClearance = NEW.zoningClearance,
     acoInspection = NEW.acoInspection,
     lastModified = NOW(),
     kennelID = NEW.kennelID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `liquorbusinessaddresses`
--

DROP TABLE IF EXISTS `liquorbusinessaddresses`;
CREATE TABLE IF NOT EXISTS `liquorbusinessaddresses` (
  `liquorBusinessAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `liquorBusinessID` int(11) DEFAULT NULL,
  PRIMARY KEY (`liquorBusinessAddressID`),
  KEY `liquorBusinessID` (`liquorBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `liquorbusinessaddresses`
--
DROP TRIGGER IF EXISTS `liquorBusinessAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `liquorBusinessAddressHistoryInsert` AFTER INSERT ON `liquorbusinessaddresses` FOR EACH ROW INSERT INTO liquorBusinessAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     liquorBusinessID = NEW.liquorBusinessID,
     liquorBusinessAddressID = NEW.liquorBusinessAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `liquorBusinessAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `liquorBusinessAddressHistoryUpdate` AFTER UPDATE ON `liquorbusinessaddresses` FOR EACH ROW INSERT INTO liquorBusinessAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     liquorBusinessID = NEW.liquorBusinessID,
     liquorBusinessAddressID = NEW.liquorBusinessAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `liquorbusinessaddresshistory`
--

DROP TABLE IF EXISTS `liquorbusinessaddresshistory`;
CREATE TABLE IF NOT EXISTS `liquorbusinessaddresshistory` (
  `liquorBusinessAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `liquorBusinessID` int(11) DEFAULT NULL,
  `liquorBusinessAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`liquorBusinessAddressHistoryID`),
  KEY `liquorBusinessID` (`liquorBusinessID`),
  KEY `liquorBusinessAddressID` (`liquorBusinessAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `liquorbusinesses`
--

DROP TABLE IF EXISTS `liquorbusinesses`;
CREATE TABLE IF NOT EXISTS `liquorbusinesses` (
  `liquorBusinessID` int(11) NOT NULL AUTO_INCREMENT,
  `businessName` varchar(50) DEFAULT NULL,
  `businessPhone` varchar(15) DEFAULT NULL,
  `contactName` varchar(50) DEFAULT NULL,
  `contactPhone` varchar(15) DEFAULT NULL,
  `dateStarted` date DEFAULT NULL,
  `applicationType` enum('New','Amendment') DEFAULT NULL,
  `feeReceived` enum('Yes','No') DEFAULT NULL,
  `municipalInformationSigned` enum('Yes','No') DEFAULT NULL,
  `municipalInformationSentToAGCO` enum('Yes','No') DEFAULT NULL,
  `fireApprovalReceived` enum('Yes','No') DEFAULT NULL,
  `fireSentToAGCO` enum('Yes','No') DEFAULT NULL,
  `planningApprovalReceived` enum('Yes','No') DEFAULT NULL,
  `planningSentToAGCO` enum('Yes','No') DEFAULT NULL,
  `smdhuApprovalReceived` enum('Yes','No') DEFAULT NULL,
  `smdhuSentToAGCO` enum('Yes','No') DEFAULT NULL,
  `buildingApprovalReceived` enum('Yes','No') DEFAULT NULL,
  `buildingSentToAGCO` enum('Yes','No') DEFAULT NULL,
  `licenseApproved` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`liquorBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `owners`
--

DROP TABLE IF EXISTS `owners`;
CREATE TABLE IF NOT EXISTS `owners` (
  `ownerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `homePhone` varchar(15) DEFAULT NULL,
  `cellPhone` varchar(15) DEFAULT NULL,
  `workPhone` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `poamatterlocations`
--

DROP TABLE IF EXISTS `poamatterlocations`;
CREATE TABLE IF NOT EXISTS `poamatterlocations` (
  `poaMatterLocationID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `poaMatterID` int(11) DEFAULT NULL,
  PRIMARY KEY (`poaMatterLocationID`),
  KEY `poaMatterID` (`poaMatterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `poamatters`
--

DROP TABLE IF EXISTS `poamatters`;
CREATE TABLE IF NOT EXISTS `poamatters` (
  `poaMatterID` int(11) NOT NULL AUTO_INCREMENT,
  `infoNumber` varchar(20) DEFAULT NULL,
  `dateOfOffence` date DEFAULT NULL,
  `dateClosed` date DEFAULT NULL,
  `officerName` varchar(50) DEFAULT NULL,
  `defendantName` varchar(50) DEFAULT NULL,
  `poaType` varchar(15) DEFAULT NULL,
  `offence` varchar(255) DEFAULT NULL,
  `setFine` int(11) DEFAULT NULL,
  `fineAssessed` int(11) DEFAULT NULL,
  `amountPaid` int(11) DEFAULT NULL,
  `prosecutor` varchar(50) DEFAULT NULL,
  `verdict` varchar(25) DEFAULT NULL,
  `comment` varchar(255) DEFAULT NULL,
  `tmpCol` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`poaMatterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `poamattertrials`
--

DROP TABLE IF EXISTS `poamattertrials`;
CREATE TABLE IF NOT EXISTS `poamattertrials` (
  `poaMatterTrialID` int(11) NOT NULL AUTO_INCREMENT,
  `trialDate` date DEFAULT NULL,
  `trialComment` varchar(255) DEFAULT NULL,
  `poaMatterID` int(11) DEFAULT NULL,
  PRIMARY KEY (`poaMatterTrialID`),
  KEY `poaMatterID` (`poaMatterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `policies`
--

DROP TABLE IF EXISTS `policies`;
CREATE TABLE IF NOT EXISTS `policies` (
  `policyID` int(11) NOT NULL AUTO_INCREMENT,
  `policyNumber` varchar(30) DEFAULT NULL,
  `policyName` varchar(80) DEFAULT NULL,
  `cowDate` date DEFAULT NULL,
  `councilResolution` varchar(30) DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `dateEffective` date DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `authority` varchar(30) DEFAULT NULL,
  `administrator` varchar(30) DEFAULT NULL,
  `legislationRequired` varchar(5) DEFAULT NULL,
  `status` enum('Archive','Active','Draft') DEFAULT NULL,
  `fileHoldURL` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `policies`
--
DROP TRIGGER IF EXISTS `policyHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `policyHistoryInsert` AFTER INSERT ON `policies` FOR EACH ROW INSERT INTO policyHistory
 SET action = 'insert',
     policyNumber = NEW.policyNumber,
     policyName = NEW.policyName,
     cowDate = NEW.cowDate,
     councilResolution = NEW.councilResolution,
     dateApproved = NEW.dateApproved,
     dateAmended = NEW.dateAmended,
     dateEffective = NEW.dateEffective,
     category = NEW.category,
     lastReviewDate = NEW.lastReviewDate,
     scheduledReviewDate = NEW.scheduledReviewDate,
     division = NEW.division,
     authority = NEW.authority,
     administrator = NEW.administrator,
     legislationRequired = NEW.legislationRequired,
     status = NEW.status,
     fileHoldURL = new.fileHoldURL,
     notes = NEW.notes,
     lastModified = NOW(),
     policyID = NEW.policyID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `policyHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `policyHistoryUpdate` AFTER UPDATE ON `policies` FOR EACH ROW INSERT INTO policyHistory
 SET action = 'update',
     policyNumber = NEW.policyNumber,
     policyName = NEW.policyName,
     cowDate = NEW.cowDate,
     councilResolution = NEW.councilResolution,
     dateApproved = NEW.dateApproved,
     dateAmended = NEW.dateAmended,
     dateEffective = NEW.dateEffective,
     category = NEW.category,
     lastReviewDate = NEW.lastReviewDate,
     scheduledReviewDate = NEW.scheduledReviewDate,
     division = NEW.division,
     authority = NEW.authority,
     administrator = NEW.administrator,
     legislationRequired = NEW.legislationRequired,
     status = NEW.status,
     fileHoldURL = new.fileHoldURL,
     notes = NEW.notes,
     lastModified = NOW(),
     policyID = NEW.policyID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `policyhistory`
--

DROP TABLE IF EXISTS `policyhistory`;
CREATE TABLE IF NOT EXISTS `policyhistory` (
  `policyHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `policyNumber` varchar(30) DEFAULT NULL,
  `policyName` varchar(80) DEFAULT NULL,
  `cowDate` date DEFAULT NULL,
  `councilResolution` varchar(30) DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `dateEffective` date DEFAULT NULL,
  `category` varchar(30) DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `authority` varchar(30) DEFAULT NULL,
  `administrator` varchar(30) DEFAULT NULL,
  `legislationRequired` varchar(5) DEFAULT NULL,
  `status` enum('Archive','Active','Draft') DEFAULT NULL,
  `fileHoldURL` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `policyID` int(11) DEFAULT NULL,
  PRIMARY KEY (`policyHistoryID`),
  KEY `policyID` (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `procedurehistory`
--

DROP TABLE IF EXISTS `procedurehistory`;
CREATE TABLE IF NOT EXISTS `procedurehistory` (
  `procedureHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `procedureName` varchar(80) DEFAULT NULL,
  `procedureNumber` varchar(30) DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `authority` varchar(30) DEFAULT NULL,
  `administrator` varchar(30) DEFAULT NULL,
  `legislationRequired` varchar(5) DEFAULT NULL,
  `fileHoldURL` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `policyID` int(11) DEFAULT NULL,
  `procedureID` int(11) DEFAULT NULL,
  PRIMARY KEY (`procedureHistoryID`),
  KEY `policyID` (`policyID`),
  KEY `procedureID` (`procedureID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `procedures`
--

DROP TABLE IF EXISTS `procedures`;
CREATE TABLE IF NOT EXISTS `procedures` (
  `procedureID` int(11) NOT NULL AUTO_INCREMENT,
  `procedureNumber` varchar(30) DEFAULT NULL,
  `procedureName` varchar(80) DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) DEFAULT NULL,
  `category` varchar(25) DEFAULT NULL,
  `division` varchar(45) DEFAULT NULL,
  `authority` varchar(30) DEFAULT NULL,
  `administrator` varchar(30) DEFAULT NULL,
  `legislationRequired` varchar(5) DEFAULT NULL,
  `fileHoldURL` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policyID` int(11) DEFAULT NULL,
  PRIMARY KEY (`procedureID`),
  KEY `policyID` (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `procedures`
--
DROP TRIGGER IF EXISTS `procedureHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `procedureHistoryInsert` AFTER INSERT ON `procedures` FOR EACH ROW INSERT INTO procedureHistory
 SET action = 'insert',
     procedureNumber = NEW.procedureNumber,
     procedureName = NEW.procedureName,
     dateApproved = NEW.dateApproved,
     lastReviewDate = NEW.lastReviewDate,
     scheduledReviewDate = NEW.scheduledReviewDate,
     dateAmended = NEW.dateAmended,
     status = NEW.status,
     category = NEW.category,
     division = NEW.division,
     authority = NEW.authority,
     administrator = NEW.administrator,
     legislationRequired = NEW.legislationRequired,
     fileholdURL = NEW.fileholdURL,
     notes = NEW.notes,
     lastModified = NOW(),
	 procedureID = NEW.procedureID,
     policyID = NEW.policyID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `procedureHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `procedureHistoryUpdate` AFTER UPDATE ON `procedures` FOR EACH ROW INSERT INTO procedureHistory
 SET action = 'update',
     procedureNumber = NEW.procedureNumber,
     procedureName = NEW.procedureName,
     dateApproved = NEW.dateApproved,
     lastReviewDate = NEW.lastReviewDate,
     scheduledReviewDate = NEW.scheduledReviewDate,
     dateAmended = NEW.dateAmended,
     status = NEW.status,
     category = NEW.category,
     division = NEW.division,
     authority = NEW.authority,
     administrator = NEW.administrator,
     legislationRequired = NEW.legislationRequired,
     fileholdURL = NEW.fileholdURL,
     notes = NEW.notes,
     lastModified = NOW(),
	 procedureID = NEW.procedureID,
     policyID = NEW.policyID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclehistory`
--

DROP TABLE IF EXISTS `refreshmentvehiclehistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclehistory` (
  `refreshmentVehicleHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `registeredBusinessName` varchar(50) DEFAULT NULL,
  `operatingBusinessName` varchar(50) DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `specialEvent` enum('Yes','No') DEFAULT NULL,
  `itemsForSale` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') DEFAULT NULL,
  `citizenship` enum('Yes','No') DEFAULT NULL,
  `insurance` enum('Yes','No') DEFAULT NULL,
  `fireApproval` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  `healthInspection` enum('Yes','No') DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehicleID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleHistoryID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleoperatoraddresses`
--

DROP TABLE IF EXISTS `refreshmentvehicleoperatoraddresses`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleoperatoraddresses` (
  `refreshmentVehicleOperatorAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `refreshmentVehicleOperatorID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOperatorAddressID`),
  KEY `refreshmentVehicleOperatorID` (`refreshmentVehicleOperatorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `refreshmentvehicleoperatoraddresses`
--
DROP TRIGGER IF EXISTS `refreshmentVehicleOperatorAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehicleOperatorAddressHistoryInsert` AFTER INSERT ON `refreshmentvehicleoperatoraddresses` FOR EACH ROW INSERT INTO refreshmentVehicleOperatorAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     refreshmentVehicleOperatorID = NEW.refreshmentVehicleOperatorID,
     refreshmentVehicleOperatorAddressID = NEW.refreshmentVehicleOperatorAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `refreshmentVehicleOperatorAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehicleOperatorAddressHistoryUpdate` AFTER UPDATE ON `refreshmentvehicleoperatoraddresses` FOR EACH ROW INSERT INTO refreshmentVehicleOperatorAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     refreshmentVehicleOperatorID = NEW.refreshmentVehicleOperatorID,
     refreshmentVehicleOperatorAddressID = NEW.refreshmentVehicleOperatorAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleoperatoraddresshistory`
--

DROP TABLE IF EXISTS `refreshmentvehicleoperatoraddresshistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleoperatoraddresshistory` (
  `refreshmentVehicleOperatorAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehicleOperatorID` int(11) DEFAULT NULL,
  `refreshmentVehicleOperatorAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOperatorAddressHistoryID`),
  KEY `refreshmentVehicleOperatorID` (`refreshmentVehicleOperatorID`),
  KEY `refreshmentVehicleOperatorAddressID` (`refreshmentVehicleOperatorAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleoperators`
--

DROP TABLE IF EXISTS `refreshmentvehicleoperators`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleoperators` (
  `refreshmentVehicleOperatorID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(25) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `refreshmentVehicleID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOperatorID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleowneraddresses`
--

DROP TABLE IF EXISTS `refreshmentvehicleowneraddresses`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleowneraddresses` (
  `refreshmentVehicleOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `refreshmentVehicleOwnerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOwnerAddressID`),
  KEY `refreshmentVehicleOwnerID` (`refreshmentVehicleOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `refreshmentvehicleowneraddresses`
--
DROP TRIGGER IF EXISTS `refreshmentVehicleOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehicleOwnerAddressHistoryInsert` AFTER INSERT ON `refreshmentvehicleowneraddresses` FOR EACH ROW INSERT INTO refreshmentVehicleOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     refreshmentVehicleOwnerID = NEW.refreshmentVehicleOwnerID,
     refreshmentVehicleOwnerAddressID = NEW.refreshmentVehicleOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `refreshmentVehicleOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehicleOwnerAddressHistoryUpdate` AFTER UPDATE ON `refreshmentvehicleowneraddresses` FOR EACH ROW INSERT INTO refreshmentVehicleOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     refreshmentVehicleOwnerID = NEW.refreshmentVehicleOwnerID,
     refreshmentVehicleOwnerAddressID = NEW.refreshmentVehicleOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleowneraddresshistory`
--

DROP TABLE IF EXISTS `refreshmentvehicleowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleowneraddresshistory` (
  `refreshmentVehicleOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehicleOwnerID` int(11) DEFAULT NULL,
  `refreshmentVehicleOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOwnerAddressHistoryID`),
  KEY `refreshmentVehicleOwnerID` (`refreshmentVehicleOwnerID`),
  KEY `refreshmentVehicleOwnerAddressID` (`refreshmentVehicleOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleowners`
--

DROP TABLE IF EXISTS `refreshmentvehicleowners`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleowners` (
  `refreshmentVehicleOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(25) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `refreshmentVehicleID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOwnerID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclepropertyowneraddresses`
--

DROP TABLE IF EXISTS `refreshmentvehiclepropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclepropertyowneraddresses` (
  `refreshmentVehiclePropertyOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `refreshmentVehiclePropertyOwnerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehiclePropertyOwnerAddressID`),
  KEY `refreshmentVehiclePropertyOwnerID` (`refreshmentVehiclePropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `refreshmentvehiclepropertyowneraddresses`
--
DROP TRIGGER IF EXISTS `refreshmentVehiclePropertyOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehiclePropertyOwnerAddressHistoryInsert` AFTER INSERT ON `refreshmentvehiclepropertyowneraddresses` FOR EACH ROW INSERT INTO refreshmentVehiclePropertyOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     refreshmentVehiclePropertyOwnerID = NEW.refreshmentVehiclePropertyOwnerID,
     refreshmentVehiclePropertyOwnerAddressID = NEW.refreshmentVehiclePropertyOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `refreshmentVehiclePropertyOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehiclePropertyOwnerAddressHistoryUpdate` AFTER UPDATE ON `refreshmentvehiclepropertyowneraddresses` FOR EACH ROW INSERT INTO refreshmentVehiclePropertyOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     refreshmentVehiclePropertyOwnerID = NEW.refreshmentVehiclePropertyOwnerID,
     refreshmentVehiclePropertyOwnerAddressID = NEW.refreshmentVehiclePropertyOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclepropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `refreshmentvehiclepropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclepropertyowneraddresshistory` (
  `refreshmentVehiclePropertyOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehiclePropertyOwnerID` int(11) DEFAULT NULL,
  `refreshmentVehiclePropertyOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehiclePropertyOwnerAddressHistoryID`),
  KEY `refreshmentVehiclePropertyOwnerID` (`refreshmentVehiclePropertyOwnerID`),
  KEY `refreshmentVehiclePropertyOwnerAddressID` (`refreshmentVehiclePropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclepropertyowners`
--

DROP TABLE IF EXISTS `refreshmentvehiclepropertyowners`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclepropertyowners` (
  `refreshmentVehiclePropertyOwnerID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) DEFAULT NULL,
  `lastName` varchar(50) DEFAULT NULL,
  `phoneNumber` varchar(20) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `refreshmentVehicleID` int(11) DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehiclePropertyOwnerID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicles`
--

DROP TABLE IF EXISTS `refreshmentvehicles`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicles` (
  `refreshmentVehicleID` int(11) NOT NULL AUTO_INCREMENT,
  `registeredBusinessName` varchar(50) DEFAULT NULL,
  `operatingBusinessName` varchar(50) DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `specialEvent` enum('Yes','No') DEFAULT NULL,
  `itemsForSale` varchar(255) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') DEFAULT NULL,
  `citizenship` enum('Yes','No') DEFAULT NULL,
  `insurance` enum('Yes','No') DEFAULT NULL,
  `fireApproval` enum('Yes','No') DEFAULT NULL,
  `zoningClearance` enum('Yes','No') DEFAULT NULL,
  `healthInspection` enum('Yes','No') DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `refreshmentvehicles`
--
DROP TRIGGER IF EXISTS `refreshmentVehicleHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehicleHistoryInsert` AFTER INSERT ON `refreshmentvehicles` FOR EACH ROW INSERT INTO refreshmentVehicleHistory
 SET action = 'insert',
     registeredBusinessName = NEW.registeredBusinessName,
     operatingBusinessName = NEW.operatingBusinessName,
	 licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     specialEvent = NEW.specialEvent,
     itemsForSale = NEW.itemsForSale,
     notes = NEW.notes,
     policeVSC = NEW.policeVSC,
     photoID = NEW.photoID,
     driversAbstract = NEW.driversAbstract,
     safetyCertificate = NEW.safetyCertificate,
     vehicleOwnership = NEW.vehicleOwnership,
     citizenship = NEW.citizenship,
     insurance = NEW.insurance,
     fireApproval = NEW.fireApproval,
     zoningClearance = NEW.zoningClearance,
     healthInspection = NEW.healthInspection,
     lastModified = NOW(),
     refreshmentVehicleID = NEW.refreshmentVehicleID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `refreshmentVehicleHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `refreshmentVehicleHistoryUpdate` AFTER UPDATE ON `refreshmentvehicles` FOR EACH ROW INSERT INTO refreshmentVehicleHistory
 SET action = 'update',
     registeredBusinessName = NEW.registeredBusinessName,
     operatingBusinessName = NEW.operatingBusinessName,
	 licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     specialEvent = NEW.specialEvent,
     itemsForSale = NEW.itemsForSale,
     notes = NEW.notes,
     policeVSC = NEW.policeVSC,
     photoID = NEW.photoID,
     driversAbstract = NEW.driversAbstract,
     safetyCertificate = NEW.safetyCertificate,
     vehicleOwnership = NEW.vehicleOwnership,
     citizenship = NEW.citizenship,
     insurance = NEW.insurance,
     fireApproval = NEW.fireApproval,
     zoningClearance = NEW.zoningClearance,
     healthInspection = NEW.healthInspection,
     lastModified = NOW(),
     refreshmentVehicleID = NEW.refreshmentVehicleID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `roleName` varchar(25) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` varchar(128) NOT NULL,
  `expires` int(10) UNSIGNED NOT NULL,
  `data` mediumtext,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecontactaddresses`
--

DROP TABLE IF EXISTS `streetclosurecontactaddresses`;
CREATE TABLE IF NOT EXISTS `streetclosurecontactaddresses` (
  `streetClosureContactAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `streetClosureContactID` int(11) DEFAULT NULL,
  `streetClosurePermitID` int(11) DEFAULT NULL,
  PRIMARY KEY (`streetClosureContactAddressID`),
  KEY `streetClosureContactID` (`streetClosureContactID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecontacts`
--

DROP TABLE IF EXISTS `streetclosurecontacts`;
CREATE TABLE IF NOT EXISTS `streetclosurecontacts` (
  `streetClosureContactID` int(11) NOT NULL AUTO_INCREMENT,
  `everydayContactName` varchar(50) DEFAULT NULL,
  `everydayContactPhone` varchar(20) DEFAULT NULL,
  `everydayContactEmail` varchar(50) DEFAULT NULL,
  `streetClosurePermitID` int(11) DEFAULT NULL,
  PRIMARY KEY (`streetClosureContactID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecoordinatoraddresses`
--

DROP TABLE IF EXISTS `streetclosurecoordinatoraddresses`;
CREATE TABLE IF NOT EXISTS `streetclosurecoordinatoraddresses` (
  `streetClosureCoordinatorAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `streetClosureCoordinatorID` int(11) DEFAULT NULL,
  `streetClosurePermitID` int(11) DEFAULT NULL,
  PRIMARY KEY (`streetClosureCoordinatorAddressID`),
  KEY `streetClosureCoordinatorID` (`streetClosureCoordinatorID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecoordinators`
--

DROP TABLE IF EXISTS `streetclosurecoordinators`;
CREATE TABLE IF NOT EXISTS `streetclosurecoordinators` (
  `streetClosureCoordinatorID` int(11) NOT NULL AUTO_INCREMENT,
  `coordinatorName` varchar(50) DEFAULT NULL,
  `coordinatorPhone` varchar(20) DEFAULT NULL,
  `coordinatorEmail` varchar(50) DEFAULT NULL,
  `streetClosurePermitID` int(11) DEFAULT NULL,
  PRIMARY KEY (`streetClosureCoordinatorID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurepermits`
--

DROP TABLE IF EXISTS `streetclosurepermits`;
CREATE TABLE IF NOT EXISTS `streetclosurepermits` (
  `streetClosurePermitID` int(11) NOT NULL AUTO_INCREMENT,
  `permitNumber` varchar(15) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `sponser` varchar(75) DEFAULT NULL,
  `closureLocation` varchar(75) DEFAULT NULL,
  `closureDate` date DEFAULT NULL,
  `closureTime` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `noiseExemption` enum('Yes','No') DEFAULT NULL,
  `alcoholServed` enum('Yes','No') DEFAULT NULL,
  `estimatedAttendance` int(11) DEFAULT NULL,
  `cleanupPlan` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`streetClosurePermitID`),
  UNIQUE KEY `permitNumber` (`permitNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tagnumberhistory`
--

DROP TABLE IF EXISTS `tagnumberhistory`;
CREATE TABLE IF NOT EXISTS `tagnumberhistory` (
  `tagNumberHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `tagNumber` varchar(25) DEFAULT NULL,
  `dogName` varchar(30) DEFAULT NULL,
  `lastModified` datetime DEFAULT CURRENT_TIMESTAMP,
  `dogID` int(11) DEFAULT NULL,
  `ownerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`tagNumberHistoryID`),
  KEY `ownerID` (`ownerID`),
  KEY `dogID` (`dogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokeraddresses`
--

DROP TABLE IF EXISTS `taxibrokeraddresses`;
CREATE TABLE IF NOT EXISTS `taxibrokeraddresses` (
  `taxiBrokerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `taxiBrokerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerAddressID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `taxibrokeraddresses`
--
DROP TRIGGER IF EXISTS `taxiBrokerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `taxiBrokerAddressHistoryInsert` AFTER INSERT ON `taxibrokeraddresses` FOR EACH ROW INSERT INTO taxiBrokerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     taxiBrokerID = NEW.taxiBrokerID,
     taxiBrokerAddressID = NEW.taxiBrokerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `taxiBrokerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `taxiBrokerAddressHistoryUpdate` AFTER UPDATE ON `taxibrokeraddresses` FOR EACH ROW INSERT INTO taxiBrokerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     taxiBrokerID = NEW.taxiBrokerID,
     taxiBrokerAddressID = NEW.taxiBrokerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokeraddresshistory`
--

DROP TABLE IF EXISTS `taxibrokeraddresshistory`;
CREATE TABLE IF NOT EXISTS `taxibrokeraddresshistory` (
  `taxiBrokerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiBrokerID` int(11) DEFAULT NULL,
  `taxiBrokerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerAddressHistoryID`),
  KEY `taxiBrokerID` (`taxiBrokerID`),
  KEY `taxiBrokerAddressID` (`taxiBrokerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokerhistory`
--

DROP TABLE IF EXISTS `taxibrokerhistory`;
CREATE TABLE IF NOT EXISTS `taxibrokerhistory` (
  `taxiBrokerHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `ownerName` varchar(50) DEFAULT NULL,
  `companyName` varchar(75) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `citizenship` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') DEFAULT NULL,
  `zoningApproval` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiBrokerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerHistoryID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokers`
--

DROP TABLE IF EXISTS `taxibrokers`;
CREATE TABLE IF NOT EXISTS `taxibrokers` (
  `taxiBrokerID` int(11) NOT NULL AUTO_INCREMENT,
  `ownerName` varchar(50) DEFAULT NULL,
  `companyName` varchar(75) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `licenseNumber` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `citizenship` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') DEFAULT NULL,
  `zoningApproval` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `taxibrokers`
--
DROP TRIGGER IF EXISTS `taxiBrokerHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `taxiBrokerHistoryInsert` AFTER INSERT ON `taxibrokers` FOR EACH ROW INSERT INTO taxiBrokerHistory
 SET action = 'insert',
     ownerName = NEW.ownerName,
     companyName = NEW.companyName,
     phoneNumber = NEW.phoneNumber,
     licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
     citizenship = NEW.citizenship,
     photoID = NEW.photoID,
     driversAbstract = NEW.driversAbstract,
     certificateOfInsurance = NEW.certificateOfInsurance,
     zoningApproval = NEW.zoningApproval,
     notes = NEW.notes,
     lastModified = NOW(),
     taxiBrokerID = NEW.taxiBrokerID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `taxiBrokerHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `taxiBrokerHistoryUpdate` AFTER UPDATE ON `taxibrokers` FOR EACH ROW INSERT INTO taxiBrokerHistory
 SET action = 'update',
     ownerName = NEW.ownerName,
     companyName = NEW.companyName,
     phoneNumber = NEW.phoneNumber,
     licenseNumber = NEW.licenseNumber,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
     citizenship = NEW.citizenship,
     photoID = NEW.photoID,
     driversAbstract = NEW.driversAbstract,
     certificateOfInsurance = NEW.certificateOfInsurance,
     zoningApproval = NEW.zoningApproval,
     notes = NEW.notes,
     lastModified = NOW(),
     taxiBrokerID = NEW.taxiBrokerID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `taxidriveraddresses`
--

DROP TABLE IF EXISTS `taxidriveraddresses`;
CREATE TABLE IF NOT EXISTS `taxidriveraddresses` (
  `taxiDriverAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `taxiDriverID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiDriverAddressID`),
  KEY `taxiDriverID` (`taxiDriverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `taxidriveraddresses`
--
DROP TRIGGER IF EXISTS `taxiDriverAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `taxiDriverAddressHistoryInsert` AFTER INSERT ON `taxidriveraddresses` FOR EACH ROW INSERT INTO taxiDriverAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     taxiDriverID = NEW.taxiDriverID,
     taxiDriverAddressID = NEW.taxiDriverAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `taxiDriverAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `taxiDriverAddressHistoryUpdate` AFTER UPDATE ON `taxidriveraddresses` FOR EACH ROW INSERT INTO taxiDriverAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     taxiDriverID = NEW.taxiDriverID,
     taxiDriverAddressID = NEW.taxiDriverAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `taxidriveraddresshistory`
--

DROP TABLE IF EXISTS `taxidriveraddresshistory`;
CREATE TABLE IF NOT EXISTS `taxidriveraddresshistory` (
  `taxiDriverAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiDriverID` int(11) DEFAULT NULL,
  `taxiDriverAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiDriverAddressHistoryID`),
  KEY `taxiDriverID` (`taxiDriverID`),
  KEY `taxiDriverAddressID` (`taxiDriverAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxidriverhistory`
--

DROP TABLE IF EXISTS `taxidriverhistory`;
CREATE TABLE IF NOT EXISTS `taxidriverhistory` (
  `taxiDriverHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `cabCompany` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `citizenship` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiDriverID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiDriverHistoryID`),
  KEY `taxiDriverID` (`taxiDriverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxidrivers`
--

DROP TABLE IF EXISTS `taxidrivers`;
CREATE TABLE IF NOT EXISTS `taxidrivers` (
  `taxiDriverID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `cabCompany` varchar(50) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `citizenship` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `taxiBrokerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiDriverID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `taxidrivers`
--
DROP TRIGGER IF EXISTS `taxiDriverHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `taxiDriverHistoryInsert` AFTER INSERT ON `taxidrivers` FOR EACH ROW INSERT INTO taxiDriverHistory
 SET action = 'insert',
     firstName = NEW.firstName,
     lastName = NEW.lastName,
     phoneNumber = NEW.phoneNumber,
     cabCompany = NEW.cabCompany,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
     citizenship = NEW.citizenship,
     photoID = NEW.photoID,
     driversAbstract = NEW.driversAbstract,
     notes = NEW.notes,
     lastModified = NOW(),
     taxiDriverID = NEW.taxiDriverID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `taxiDriverHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `taxiDriverHistoryUpdate` AFTER UPDATE ON `taxidrivers` FOR EACH ROW INSERT INTO taxiDriverHistory
 SET action = 'update',
     firstName = NEW.firstName,
     lastName = NEW.lastName,
     phoneNumber = NEW.phoneNumber,
     cabCompany = NEW.cabCompany,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
     citizenship = NEW.citizenship,
     photoID = NEW.photoID,
     driversAbstract = NEW.driversAbstract,
     notes = NEW.notes,
     lastModified = NOW(),
     taxiDriverID = NEW.taxiDriverID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplatehistory`
--

DROP TABLE IF EXISTS `taxiplatehistory`;
CREATE TABLE IF NOT EXISTS `taxiplatehistory` (
  `taxiPlateHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `townPlateNumber` int(11) DEFAULT NULL,
  `vehicleYearMakeModel` varchar(40) DEFAULT NULL,
  `provincialPlate` varchar(20) DEFAULT NULL,
  `vin` varchar(40) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') DEFAULT NULL,
  `byLawInspection` enum('Yes','No') DEFAULT NULL,
  `insurance` enum('Yes','No') DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiPlateID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiPlateHistoryID`),
  KEY `taxiPlateID` (`taxiPlateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplateowneraddresses`
--

DROP TABLE IF EXISTS `taxiplateowneraddresses`;
CREATE TABLE IF NOT EXISTS `taxiplateowneraddresses` (
  `taxiPlateOwnerAddressID` int(11) NOT NULL AUTO_INCREMENT,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `taxiPlateID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiPlateOwnerAddressID`),
  KEY `taxiPlateID` (`taxiPlateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `taxiplateowneraddresses`
--
DROP TRIGGER IF EXISTS `taxiPlateOwnerAddressHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `taxiPlateOwnerAddressHistoryInsert` AFTER INSERT ON `taxiplateowneraddresses` FOR EACH ROW INSERT INTO taxiPlateOwnerAddressHistory
 SET action = 'insert',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     taxiPlateID = NEW.taxiPlateID,
     taxiPlateOwnerAddressID = NEW.taxiPlateOwnerAddressID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `taxiPlateOwnerAddressHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `taxiPlateOwnerAddressHistoryUpdate` AFTER UPDATE ON `taxiplateowneraddresses` FOR EACH ROW INSERT INTO taxiPlateOwnerAddressHistory
 SET action = 'update',
	 streetNumber = NEW.streetNumber,
	 streetName = NEW.streetName,
	 town = NEW.town,
	 postalCode = NEW.postalCode,
     lastModified = NOW(),
     taxiPlateID = NEW.taxiPlateID,
     taxiPlateOwnerAddressID = NEW.taxiPlateOwnerAddressID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplateowneraddresshistory`
--

DROP TABLE IF EXISTS `taxiplateowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `taxiplateowneraddresshistory` (
  `taxiPlateOwnerAddressHistoryID` int(11) NOT NULL AUTO_INCREMENT,
  `action` varchar(20) NOT NULL,
  `streetNumber` int(11) DEFAULT NULL,
  `streetName` varchar(50) DEFAULT NULL,
  `town` varchar(30) DEFAULT NULL,
  `postalCode` varchar(15) DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiPlateID` int(11) DEFAULT NULL,
  `taxiPlateOwnerAddressID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiPlateOwnerAddressHistoryID`),
  KEY `taxiPlateID` (`taxiPlateID`),
  KEY `taxiPlateOwnerAddressID` (`taxiPlateOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplates`
--

DROP TABLE IF EXISTS `taxiplates`;
CREATE TABLE IF NOT EXISTS `taxiplates` (
  `taxiPlateID` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `phoneNumber` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `townPlateNumber` int(11) DEFAULT NULL,
  `vehicleYearMakeModel` varchar(40) DEFAULT NULL,
  `provincialPlate` varchar(20) DEFAULT NULL,
  `vin` varchar(40) DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') DEFAULT NULL,
  `driversAbstract` enum('Yes','No') DEFAULT NULL,
  `photoID` enum('Yes','No') DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') DEFAULT NULL,
  `byLawInspection` enum('Yes','No') DEFAULT NULL,
  `insurance` enum('Yes','No') DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `taxiBrokerID` int(11) DEFAULT NULL,
  PRIMARY KEY (`taxiPlateID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Triggers `taxiplates`
--
DROP TRIGGER IF EXISTS `taxiPlateHistoryInsert`;
DELIMITER $$
CREATE TRIGGER `taxiPlateHistoryInsert` AFTER INSERT ON `taxiplates` FOR EACH ROW INSERT INTO taxiPlateHistory
 SET action = 'insert',
     firstName = NEW.firstName,
     lastName = NEW.lastName,
     phoneNumber = NEW.phoneNumber,
     email = NEW.email,
     townPlateNumber = NEW.townPlateNumber,
     vehicleYearMakeModel = NEW.vehicleYearMakeModel,
     provincialPlate = NEW.provincialPlate,
     vin = NEW.vin,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
	 driversAbstract = NEW.driversAbstract,
     photoID = NEW.photoID,
     safetyCertificate = NEW.safetyCertificate,
     byLawInspection = NEW.byLawInspection,
     insurance = NEW.insurance,
     vehicleOwnership = NEW.vehicleOwnership,
     notes = NEW.notes,
     lastModified = NOW(),
     taxiPlateID = NEW.taxiPlateID
$$
DELIMITER ;
DROP TRIGGER IF EXISTS `taxiPlateHistoryUpdate`;
DELIMITER $$
CREATE TRIGGER `taxiPlateHistoryUpdate` AFTER UPDATE ON `taxiplates` FOR EACH ROW INSERT INTO taxiPlateHistory
 SET action = 'update',
     firstName = NEW.firstName,
     lastName = NEW.lastName,
     phoneNumber = NEW.phoneNumber,
     email = NEW.email,
     townPlateNumber = NEW.townPlateNumber,
     vehicleYearMakeModel = NEW.vehicleYearMakeModel,
     provincialPlate = NEW.provincialPlate,
     vin = NEW.vin,
     issueDate = NEW.issueDate,
     expiryDate = NEW.expiryDate,
     policeVSC = NEW.policeVSC,
	 driversAbstract = NEW.driversAbstract,
     photoID = NEW.photoID,
     safetyCertificate = NEW.safetyCertificate,
     byLawInspection = NEW.byLawInspection,
     insurance = NEW.insurance,
     vehicleOwnership = NEW.vehicleOwnership,
     notes = NEW.notes,
     lastModified = NOW(),
     taxiPlateID = NEW.taxiPlateID
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
CREATE TABLE IF NOT EXISTS `userroles` (
  `userRoleID` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  PRIMARY KEY (`userRoleID`),
  UNIQUE KEY `userroles_roleId_userId_unique` (`userId`,`roleId`),
  KEY `roleId` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) DEFAULT NULL,
  `lastName` varchar(25) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `additionalowners`
--
ALTER TABLE `additionalowners`
  ADD CONSTRAINT `additionalowners_ibfk_1` FOREIGN KEY (`ownerID`) REFERENCES `owners` (`ownerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `addresses`
--
ALTER TABLE `addresses`
  ADD CONSTRAINT `addresses_ibfk_1` FOREIGN KEY (`ownerID`) REFERENCES `owners` (`ownerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `addresshistory`
--
ALTER TABLE `addresshistory`
  ADD CONSTRAINT `FK_addressID` FOREIGN KEY (`addressID`) REFERENCES `addresses` (`addressID`),
  ADD CONSTRAINT `FK_ownerID` FOREIGN KEY (`ownerID`) REFERENCES `owners` (`ownerID`);

--
-- Constraints for table `businessaddresses`
--
ALTER TABLE `businessaddresses`
  ADD CONSTRAINT `businessaddresses_ibfk_1` FOREIGN KEY (`businessID`) REFERENCES `businesses` (`businessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `businessesaddresshistory`
--
ALTER TABLE `businessesaddresshistory`
  ADD CONSTRAINT `businessesaddresshistory_ibfk_1` FOREIGN KEY (`businessAddressID`) REFERENCES `businessaddresses` (`businessAddressID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `businessesaddresshistory_ibfk_2` FOREIGN KEY (`businessID`) REFERENCES `businesses` (`businessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `businesshistory`
--
ALTER TABLE `businesshistory`
  ADD CONSTRAINT `businesshistory_ibfk_1` FOREIGN KEY (`businessID`) REFERENCES `businesses` (`businessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `doghistory`
--
ALTER TABLE `doghistory`
  ADD CONSTRAINT `FK_dogID` FOREIGN KEY (`dogID`) REFERENCES `dogs` (`dogID`);

--
-- Constraints for table `dogs`
--
ALTER TABLE `dogs`
  ADD CONSTRAINT `dogs_ibfk_1` FOREIGN KEY (`ownerID`) REFERENCES `owners` (`ownerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinaddresses`
--
ALTER TABLE `donationbinaddresses`
  ADD CONSTRAINT `donationbinaddresses_ibfk_1` FOREIGN KEY (`donationBinID`) REFERENCES `donationbins` (`donationBinID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinaddresshistory`
--
ALTER TABLE `donationbinaddresshistory`
  ADD CONSTRAINT `donationbinaddresshistory_ibfk_1` FOREIGN KEY (`donationBinID`) REFERENCES `donationbins` (`donationBinID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `donationbinaddresshistory_ibfk_2` FOREIGN KEY (`donationBinAddressID`) REFERENCES `donationbinaddresses` (`donationBinAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbincharities`
--
ALTER TABLE `donationbincharities`
  ADD CONSTRAINT `donationbincharities_ibfk_1` FOREIGN KEY (`donationBinID`) REFERENCES `donationbins` (`donationBinID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinhistory`
--
ALTER TABLE `donationbinhistory`
  ADD CONSTRAINT `donationbinhistory_ibfk_1` FOREIGN KEY (`donationBinID`) REFERENCES `donationbins` (`donationBinID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinoperatoraddresses`
--
ALTER TABLE `donationbinoperatoraddresses`
  ADD CONSTRAINT `donationbinoperatoraddresses_ibfk_1` FOREIGN KEY (`donationBinOperatorID`) REFERENCES `donationbinoperators` (`donationBinOperatorID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinoperatoraddresshistory`
--
ALTER TABLE `donationbinoperatoraddresshistory`
  ADD CONSTRAINT `donationbinoperatoraddresshistory_ibfk_1` FOREIGN KEY (`donationBinOperatorID`) REFERENCES `donationbinoperators` (`donationBinOperatorID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `donationbinoperatoraddresshistory_ibfk_2` FOREIGN KEY (`donationBinOperatorAddressID`) REFERENCES `donationbinoperatoraddresses` (`donationBinOperatorAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinoperators`
--
ALTER TABLE `donationbinoperators`
  ADD CONSTRAINT `donationbinoperators_ibfk_1` FOREIGN KEY (`donationBinID`) REFERENCES `donationbins` (`donationBinID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinpropertyowneraddresses`
--
ALTER TABLE `donationbinpropertyowneraddresses`
  ADD CONSTRAINT `donationbinpropertyowneraddresses_ibfk_1` FOREIGN KEY (`donationBinPropertyOwnerID`) REFERENCES `donationbinpropertyowners` (`donationBinPropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinpropertyowneraddresshistory`
--
ALTER TABLE `donationbinpropertyowneraddresshistory`
  ADD CONSTRAINT `donationbinpropertyowneraddresshistory_ibfk_1` FOREIGN KEY (`donationBinPropertyOwnerID`) REFERENCES `donationbinpropertyowners` (`donationBinPropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `donationbinpropertyowneraddresshistory_ibfk_2` FOREIGN KEY (`donationBinPropertyOwnerAddressID`) REFERENCES `donationbinpropertyowneraddresses` (`donationBinPropertyOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `donationbinpropertyowners`
--
ALTER TABLE `donationbinpropertyowners`
  ADD CONSTRAINT `donationbinpropertyowners_ibfk_1` FOREIGN KEY (`donationBinID`) REFERENCES `donationbins` (`donationBinID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `dropdowns`
--
ALTER TABLE `dropdowns`
  ADD CONSTRAINT `dropdowns_ibfk_1` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_10` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_11` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_12` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_13` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_14` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_15` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_16` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_17` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_18` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_19` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_2` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_20` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_21` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_22` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_23` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_24` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_25` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_26` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_27` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_28` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_29` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_3` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_30` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_31` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_32` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_33` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_34` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_35` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_36` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_37` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_38` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_39` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_4` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_40` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_41` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_42` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_43` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_44` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_45` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_46` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_47` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_48` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_49` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_5` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_50` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_51` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_52` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_53` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_54` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_55` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_56` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_57` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_58` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_59` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_6` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_60` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_61` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_62` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_7` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_8` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `dropdowns_ibfk_9` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `guidelinehistory`
--
ALTER TABLE `guidelinehistory`
  ADD CONSTRAINT `guidelinehistory_ibfk_1` FOREIGN KEY (`policyID`) REFERENCES `policies` (`policyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `guidelinehistory_ibfk_2` FOREIGN KEY (`guidelineID`) REFERENCES `guidelines` (`guidelineID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `guidelines`
--
ALTER TABLE `guidelines`
  ADD CONSTRAINT `guidelines_ibfk_1` FOREIGN KEY (`policyID`) REFERENCES `policies` (`policyID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerapplicantaddresses`
--
ALTER TABLE `hawkerpeddlerapplicantaddresses`
  ADD CONSTRAINT `hawkerpeddlerapplicantaddresses_ibfk_1` FOREIGN KEY (`hawkerPeddlerApplicantID`) REFERENCES `hawkerpeddlerapplicants` (`hawkerPeddlerApplicantID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerapplicantaddresshistory`
--
ALTER TABLE `hawkerpeddlerapplicantaddresshistory`
  ADD CONSTRAINT `hawkerpeddlerapplicantaddresshistory_ibfk_1` FOREIGN KEY (`hawkerPeddlerApplicantID`) REFERENCES `hawkerpeddlerapplicants` (`hawkerPeddlerApplicantID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `hawkerpeddlerapplicantaddresshistory_ibfk_2` FOREIGN KEY (`hawkerPeddlerApplicantAddressID`) REFERENCES `hawkerpeddlerapplicantaddresses` (`hawkerPeddlerApplicantAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerapplicants`
--
ALTER TABLE `hawkerpeddlerapplicants`
  ADD CONSTRAINT `hawkerpeddlerapplicants_ibfk_1` FOREIGN KEY (`hawkerPeddlerBusinessID`) REFERENCES `hawkerpeddlerbusinesses` (`hawkerPeddlerBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerbusinessaddresses`
--
ALTER TABLE `hawkerpeddlerbusinessaddresses`
  ADD CONSTRAINT `hawkerpeddlerbusinessaddresses_ibfk_1` FOREIGN KEY (`hawkerPeddlerBusinessID`) REFERENCES `hawkerpeddlerbusinesses` (`hawkerPeddlerBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerbusinessaddresshistory`
--
ALTER TABLE `hawkerpeddlerbusinessaddresshistory`
  ADD CONSTRAINT `hawkerpeddlerbusinessaddresshistory_ibfk_1` FOREIGN KEY (`hawkerPeddlerBusinessID`) REFERENCES `hawkerpeddlerbusinesses` (`hawkerPeddlerBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `hawkerpeddlerbusinessaddresshistory_ibfk_2` FOREIGN KEY (`hawkerPeddlerBusinessAddressID`) REFERENCES `hawkerpeddlerbusinessaddresses` (`hawkerPeddlerBusinessAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddleroperatorhistory`
--
ALTER TABLE `hawkerpeddleroperatorhistory`
  ADD CONSTRAINT `hawkerpeddleroperatorhistory_ibfk_1` FOREIGN KEY (`hawkerPeddlerApplicantID`) REFERENCES `hawkerpeddlerapplicants` (`hawkerPeddlerApplicantID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerpropertyowneraddresses`
--
ALTER TABLE `hawkerpeddlerpropertyowneraddresses`
  ADD CONSTRAINT `hawkerpeddlerpropertyowneraddresses_ibfk_1` FOREIGN KEY (`hawkerPeddlerPropertyOwnerID`) REFERENCES `hawkerpeddlerpropertyowners` (`hawkerPeddlerPropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerpropertyowneraddresshistory`
--
ALTER TABLE `hawkerpeddlerpropertyowneraddresshistory`
  ADD CONSTRAINT `hawkerpeddlerpropertyowneraddresshistory_ibfk_1` FOREIGN KEY (`hawkerPeddlerPropertyOwnerID`) REFERENCES `hawkerpeddlerpropertyowners` (`hawkerPeddlerPropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `hawkerpeddlerpropertyowneraddresshistory_ibfk_2` FOREIGN KEY (`hawkerPeddlerPropertyOwnerAddressID`) REFERENCES `hawkerpeddlerpropertyowneraddresses` (`hawkerPeddlerPropertyOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `hawkerpeddlerpropertyowners`
--
ALTER TABLE `hawkerpeddlerpropertyowners`
  ADD CONSTRAINT `hawkerpeddlerpropertyowners_ibfk_1` FOREIGN KEY (`hawkerPeddlerBusinessID`) REFERENCES `hawkerpeddlerbusinesses` (`hawkerPeddlerBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kenneladdresses`
--
ALTER TABLE `kenneladdresses`
  ADD CONSTRAINT `kenneladdresses_ibfk_1` FOREIGN KEY (`kennelID`) REFERENCES `kennels` (`kennelID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kenneladdresshistory`
--
ALTER TABLE `kenneladdresshistory`
  ADD CONSTRAINT `kenneladdresshistory_ibfk_1` FOREIGN KEY (`kennelID`) REFERENCES `kennels` (`kennelID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kenneladdresshistory_ibfk_2` FOREIGN KEY (`kennelAddressID`) REFERENCES `kenneladdresses` (`kennelAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelhistory`
--
ALTER TABLE `kennelhistory`
  ADD CONSTRAINT `kennelhistory_ibfk_1` FOREIGN KEY (`kennelID`) REFERENCES `kennels` (`kennelID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelowneraddresses`
--
ALTER TABLE `kennelowneraddresses`
  ADD CONSTRAINT `kennelowneraddresses_ibfk_1` FOREIGN KEY (`kennelOwnerID`) REFERENCES `kennelowners` (`kennelOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelowneraddresshistory`
--
ALTER TABLE `kennelowneraddresshistory`
  ADD CONSTRAINT `kennelowneraddresshistory_ibfk_1` FOREIGN KEY (`kennelOwnerID`) REFERENCES `kennelowners` (`kennelOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kennelowneraddresshistory_ibfk_2` FOREIGN KEY (`kennelOwnerAddressID`) REFERENCES `kennelowneraddresses` (`kennelOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelowners`
--
ALTER TABLE `kennelowners`
  ADD CONSTRAINT `kennelowners_ibfk_1` FOREIGN KEY (`kennelID`) REFERENCES `kennels` (`kennelID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelpropertyowneraddresses`
--
ALTER TABLE `kennelpropertyowneraddresses`
  ADD CONSTRAINT `kennelpropertyowneraddresses_ibfk_1` FOREIGN KEY (`kennelPropertyOwnerID`) REFERENCES `kennelpropertyowners` (`kennelPropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelpropertyowneraddresshistory`
--
ALTER TABLE `kennelpropertyowneraddresshistory`
  ADD CONSTRAINT `kennelpropertyowneraddresshistory_ibfk_1` FOREIGN KEY (`kennelPropertyOwnerID`) REFERENCES `kennelpropertyowners` (`kennelPropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kennelpropertyowneraddresshistory_ibfk_2` FOREIGN KEY (`kennelPropertyOwnerAddressID`) REFERENCES `kennelpropertyowneraddresses` (`kennelPropertyOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `kennelpropertyowners`
--
ALTER TABLE `kennelpropertyowners`
  ADD CONSTRAINT `kennelpropertyowners_ibfk_1` FOREIGN KEY (`kennelID`) REFERENCES `kennels` (`kennelID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `liquorbusinessaddresses`
--
ALTER TABLE `liquorbusinessaddresses`
  ADD CONSTRAINT `liquorbusinessaddresses_ibfk_1` FOREIGN KEY (`liquorBusinessID`) REFERENCES `liquorbusinesses` (`liquorBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `liquorbusinessaddresshistory`
--
ALTER TABLE `liquorbusinessaddresshistory`
  ADD CONSTRAINT `liquorbusinessaddresshistory_ibfk_1` FOREIGN KEY (`liquorBusinessID`) REFERENCES `liquorbusinesses` (`liquorBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `liquorbusinessaddresshistory_ibfk_2` FOREIGN KEY (`liquorBusinessAddressID`) REFERENCES `liquorbusinessaddresses` (`liquorBusinessAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `poamatterlocations`
--
ALTER TABLE `poamatterlocations`
  ADD CONSTRAINT `poamatterlocations_ibfk_1` FOREIGN KEY (`poaMatterID`) REFERENCES `poamatters` (`poaMatterID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `poamattertrials`
--
ALTER TABLE `poamattertrials`
  ADD CONSTRAINT `poamattertrials_ibfk_1` FOREIGN KEY (`poaMatterID`) REFERENCES `poamatters` (`poaMatterID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `policyhistory`
--
ALTER TABLE `policyhistory`
  ADD CONSTRAINT `policyhistory_ibfk_1` FOREIGN KEY (`policyID`) REFERENCES `policies` (`policyID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `procedurehistory`
--
ALTER TABLE `procedurehistory`
  ADD CONSTRAINT `procedurehistory_ibfk_1` FOREIGN KEY (`policyID`) REFERENCES `policies` (`policyID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `procedurehistory_ibfk_2` FOREIGN KEY (`procedureID`) REFERENCES `procedures` (`procedureID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `procedures`
--
ALTER TABLE `procedures`
  ADD CONSTRAINT `procedures_ibfk_1` FOREIGN KEY (`policyID`) REFERENCES `policies` (`policyID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehiclehistory`
--
ALTER TABLE `refreshmentvehiclehistory`
  ADD CONSTRAINT `refreshmentvehiclehistory_ibfk_1` FOREIGN KEY (`refreshmentVehicleID`) REFERENCES `refreshmentvehicles` (`refreshmentVehicleID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehicleoperatoraddresses`
--
ALTER TABLE `refreshmentvehicleoperatoraddresses`
  ADD CONSTRAINT `refreshmentvehicleoperatoraddresses_ibfk_1` FOREIGN KEY (`refreshmentVehicleOperatorID`) REFERENCES `refreshmentvehicleoperators` (`refreshmentVehicleOperatorID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehicleoperatoraddresshistory`
--
ALTER TABLE `refreshmentvehicleoperatoraddresshistory`
  ADD CONSTRAINT `refreshmentvehicleoperatoraddresshistory_ibfk_1` FOREIGN KEY (`refreshmentVehicleOperatorID`) REFERENCES `refreshmentvehicleoperators` (`refreshmentVehicleOperatorID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `refreshmentvehicleoperatoraddresshistory_ibfk_2` FOREIGN KEY (`refreshmentVehicleOperatorAddressID`) REFERENCES `refreshmentvehicleoperatoraddresses` (`refreshmentVehicleOperatorAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehicleoperators`
--
ALTER TABLE `refreshmentvehicleoperators`
  ADD CONSTRAINT `refreshmentvehicleoperators_ibfk_1` FOREIGN KEY (`refreshmentVehicleID`) REFERENCES `refreshmentvehicles` (`refreshmentVehicleID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehicleowneraddresses`
--
ALTER TABLE `refreshmentvehicleowneraddresses`
  ADD CONSTRAINT `refreshmentvehicleowneraddresses_ibfk_1` FOREIGN KEY (`refreshmentVehicleOwnerID`) REFERENCES `refreshmentvehicleowners` (`refreshmentVehicleOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehicleowneraddresshistory`
--
ALTER TABLE `refreshmentvehicleowneraddresshistory`
  ADD CONSTRAINT `refreshmentvehicleowneraddresshistory_ibfk_1` FOREIGN KEY (`refreshmentVehicleOwnerID`) REFERENCES `refreshmentvehicleowners` (`refreshmentVehicleOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `refreshmentvehicleowneraddresshistory_ibfk_2` FOREIGN KEY (`refreshmentVehicleOwnerAddressID`) REFERENCES `refreshmentvehicleowneraddresses` (`refreshmentVehicleOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehicleowners`
--
ALTER TABLE `refreshmentvehicleowners`
  ADD CONSTRAINT `refreshmentvehicleowners_ibfk_1` FOREIGN KEY (`refreshmentVehicleID`) REFERENCES `refreshmentvehicles` (`refreshmentVehicleID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehiclepropertyowneraddresses`
--
ALTER TABLE `refreshmentvehiclepropertyowneraddresses`
  ADD CONSTRAINT `refreshmentvehiclepropertyowneraddresses_ibfk_1` FOREIGN KEY (`refreshmentVehiclePropertyOwnerID`) REFERENCES `refreshmentvehiclepropertyowners` (`refreshmentVehiclePropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehiclepropertyowneraddresshistory`
--
ALTER TABLE `refreshmentvehiclepropertyowneraddresshistory`
  ADD CONSTRAINT `refreshmentvehiclepropertyowneraddresshistory_ibfk_1` FOREIGN KEY (`refreshmentVehiclePropertyOwnerID`) REFERENCES `refreshmentvehiclepropertyowners` (`refreshmentVehiclePropertyOwnerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `refreshmentvehiclepropertyowneraddresshistory_ibfk_2` FOREIGN KEY (`refreshmentVehiclePropertyOwnerAddressID`) REFERENCES `refreshmentvehiclepropertyowneraddresses` (`refreshmentVehiclePropertyOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `refreshmentvehiclepropertyowners`
--
ALTER TABLE `refreshmentvehiclepropertyowners`
  ADD CONSTRAINT `refreshmentvehiclepropertyowners_ibfk_1` FOREIGN KEY (`refreshmentVehicleID`) REFERENCES `refreshmentvehicles` (`refreshmentVehicleID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `streetclosurecontactaddresses`
--
ALTER TABLE `streetclosurecontactaddresses`
  ADD CONSTRAINT `streetclosurecontactaddresses_ibfk_1` FOREIGN KEY (`streetClosureContactID`) REFERENCES `streetclosurecontacts` (`streetClosureContactID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `streetclosurecontactaddresses_ibfk_2` FOREIGN KEY (`streetClosurePermitID`) REFERENCES `streetclosurepermits` (`streetClosurePermitID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `streetclosurecontacts`
--
ALTER TABLE `streetclosurecontacts`
  ADD CONSTRAINT `streetclosurecontacts_ibfk_1` FOREIGN KEY (`streetClosurePermitID`) REFERENCES `streetclosurepermits` (`streetClosurePermitID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `streetclosurecoordinatoraddresses`
--
ALTER TABLE `streetclosurecoordinatoraddresses`
  ADD CONSTRAINT `streetclosurecoordinatoraddresses_ibfk_1` FOREIGN KEY (`streetClosureCoordinatorID`) REFERENCES `streetclosurecoordinators` (`streetClosureCoordinatorID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `streetclosurecoordinatoraddresses_ibfk_2` FOREIGN KEY (`streetClosurePermitID`) REFERENCES `streetclosurepermits` (`streetClosurePermitID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `streetclosurecoordinators`
--
ALTER TABLE `streetclosurecoordinators`
  ADD CONSTRAINT `streetclosurecoordinators_ibfk_1` FOREIGN KEY (`streetClosurePermitID`) REFERENCES `streetclosurepermits` (`streetClosurePermitID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxibrokeraddresses`
--
ALTER TABLE `taxibrokeraddresses`
  ADD CONSTRAINT `taxibrokeraddresses_ibfk_1` FOREIGN KEY (`taxiBrokerID`) REFERENCES `taxibrokers` (`taxiBrokerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxibrokeraddresshistory`
--
ALTER TABLE `taxibrokeraddresshistory`
  ADD CONSTRAINT `taxibrokeraddresshistory_ibfk_1` FOREIGN KEY (`taxiBrokerID`) REFERENCES `taxibrokers` (`taxiBrokerID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `taxibrokeraddresshistory_ibfk_2` FOREIGN KEY (`taxiBrokerAddressID`) REFERENCES `taxibrokeraddresses` (`taxiBrokerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxibrokerhistory`
--
ALTER TABLE `taxibrokerhistory`
  ADD CONSTRAINT `taxibrokerhistory_ibfk_1` FOREIGN KEY (`taxiBrokerID`) REFERENCES `taxibrokers` (`taxiBrokerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxidriveraddresses`
--
ALTER TABLE `taxidriveraddresses`
  ADD CONSTRAINT `taxidriveraddresses_ibfk_1` FOREIGN KEY (`taxiDriverID`) REFERENCES `taxidrivers` (`taxiDriverID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxidriveraddresshistory`
--
ALTER TABLE `taxidriveraddresshistory`
  ADD CONSTRAINT `taxidriveraddresshistory_ibfk_1` FOREIGN KEY (`taxiDriverID`) REFERENCES `taxidrivers` (`taxiDriverID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `taxidriveraddresshistory_ibfk_2` FOREIGN KEY (`taxiDriverAddressID`) REFERENCES `taxidriveraddresses` (`taxiDriverAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxidriverhistory`
--
ALTER TABLE `taxidriverhistory`
  ADD CONSTRAINT `taxidriverhistory_ibfk_1` FOREIGN KEY (`taxiDriverID`) REFERENCES `taxidrivers` (`taxiDriverID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxidrivers`
--
ALTER TABLE `taxidrivers`
  ADD CONSTRAINT `taxidrivers_ibfk_1` FOREIGN KEY (`taxiBrokerID`) REFERENCES `taxibrokers` (`taxiBrokerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxiplatehistory`
--
ALTER TABLE `taxiplatehistory`
  ADD CONSTRAINT `taxiplatehistory_ibfk_1` FOREIGN KEY (`taxiPlateID`) REFERENCES `taxiplates` (`taxiPlateID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxiplateowneraddresses`
--
ALTER TABLE `taxiplateowneraddresses`
  ADD CONSTRAINT `taxiplateowneraddresses_ibfk_1` FOREIGN KEY (`taxiPlateID`) REFERENCES `taxiplates` (`taxiPlateID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxiplateowneraddresshistory`
--
ALTER TABLE `taxiplateowneraddresshistory`
  ADD CONSTRAINT `taxiplateowneraddresshistory_ibfk_1` FOREIGN KEY (`taxiPlateID`) REFERENCES `taxiplates` (`taxiPlateID`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `taxiplateowneraddresshistory_ibfk_2` FOREIGN KEY (`taxiPlateOwnerAddressID`) REFERENCES `taxiplateowneraddresses` (`taxiPlateOwnerAddressID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `taxiplates`
--
ALTER TABLE `taxiplates`
  ADD CONSTRAINT `taxiplates_ibfk_1` FOREIGN KEY (`taxiBrokerID`) REFERENCES `taxibrokers` (`taxiBrokerID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `userroles`
--
ALTER TABLE `userroles`
  ADD CONSTRAINT `userroles_ibfk_13` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_14` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
