-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 30, 2022 at 06:25 PM
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `additionalowners`
--

INSERT INTO `additionalowners` (`additionalOwnerID`, `firstName`, `lastName`, `homePhone`, `cellPhone`, `workPhone`, `email`, `ownerID`) VALUES
(1, 'Additional', 'Owner', '123-123-1234', '', '', 'additional@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `addresses`
--

INSERT INTO `addresses` (`addressID`, `streetNumber`, `streetName`, `poBoxAptRR`, `town`, `postalCode`, `ownerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'PO Box 1', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `addresshistory`
--

INSERT INTO `addresshistory` (`addressHistoryID`, `action`, `streetNumber`, `streetName`, `poBoxAptRR`, `town`, `postalCode`, `lastModified`, `ownerID`, `addressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'PO Box 1', 'Bradford', 'L9S 2E5', '2022-08-30 14:02:45', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `businessaddresses`
--

INSERT INTO `businessaddresses` (`businessAddressID`, `streetNumber`, `streetName`, `poBoxAptRR`, `town`, `postalCode`, `businessID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'PO Box 1', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `businesses`
--

INSERT INTO `businesses` (`businessID`, `businessName`, `ownerName`, `contactName`, `contactPhone`, `licenseNumber`, `issueDate`, `expiryDate`, `policeVSC`, `certificateOfInsurance`, `photoID`, `healthInspection`, `zoningClearance`, `feePaid`, `notes`) VALUES
(1, 'Business Name', 'Owner Name', 'Contact Name', '123-123-1234', 'ABC-123', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `businessesaddresshistory`
--

INSERT INTO `businessesaddresshistory` (`businessAddressHistoryID`, `action`, `streetNumber`, `streetName`, `poBoxAptRR`, `town`, `postalCode`, `lastModified`, `businessAddressID`, `businessID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'PO Box 1', 'Bradford', 'L9S 2E5', '2022-08-30 13:59:22', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `businesshistory`
--

INSERT INTO `businesshistory` (`businessHistoryID`, `action`, `businessName`, `ownerName`, `contactName`, `contactPhone`, `licenseNumber`, `issueDate`, `expiryDate`, `policeVSC`, `certificateOfInsurance`, `photoID`, `healthInspection`, `zoningClearance`, `feePaid`, `notes`, `lastModified`, `businessID`) VALUES
(1, 'insert', 'Business Name', 'Owner Name', 'Contact Name', '123-123-1234', 'ABC-123', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes', '2022-08-30 13:59:22', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `doghistory`
--

INSERT INTO `doghistory` (`dogHistoryID`, `action`, `tagNumber`, `dogName`, `breed`, `colour`, `gender`, `dateOfBirth`, `designation`, `spade`, `rabiesTagNumber`, `rabiesExpiry`, `vetOffice`, `tagRequired`, `issueDate`, `expiryDate`, `vendor`, `notes`, `lastModified`, `dogID`, `ownerID`) VALUES
(1, 'insert', '1', 'Greenlee', 'Golden Retriever', 'Golden', 'F', NULL, 'None', 'Spade', 'XYZ-123', '2022-08-01', 'Test Office', NULL, '2022-08-30', '2023-01-31', 'Online', '- Test Notes', '2022-08-30 14:04:02', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dogs`
--

INSERT INTO `dogs` (`dogID`, `tagNumber`, `dogName`, `breed`, `colour`, `gender`, `dateOfBirth`, `designation`, `spade`, `rabiesTagNumber`, `rabiesExpiry`, `vetOffice`, `tagRequired`, `issueDate`, `expiryDate`, `vendor`, `notes`, `ownerID`) VALUES
(1, '1', 'Greenlee', 'Golden Retriever', 'Golden', 'F', NULL, 'None', 'Spade', 'XYZ-123', '2022-08-01', 'Test Office', NULL, '2022-08-30', '2023-01-31', 'Online', '- Test Notes', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinaddresses`
--

INSERT INTO `donationbinaddresses` (`donationBinAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `donationBinID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinaddresshistory`
--

INSERT INTO `donationbinaddresshistory` (`donationBinAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `donationBinID`, `donationBinAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:00:35', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbincharities`
--

INSERT INTO `donationbincharities` (`donationBinCharityID`, `charityName`, `registrationNumber`, `phoneNumber`, `email`, `organizationType`, `donationBinID`) VALUES
(1, 'Charity Name', 'ABC-123', '123-123-1234', 'charity@name.com', 'Not-For-Profit', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinhistory`
--

INSERT INTO `donationbinhistory` (`donationBinHistoryID`, `action`, `licenseNumber`, `issueDate`, `expiryDate`, `itemsCollected`, `pickupSchedule`, `colour`, `material`, `notes`, `lastModified`, `donationBinID`) VALUES
(1, 'insert', 'ABC-123', '2022-08-01', '2022-08-02', '- Items Collected', 'Mon-Fri', 'Metal', 'Steel', '- Test Notes', '2022-08-30 14:00:35', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinoperatoraddresses`
--

INSERT INTO `donationbinoperatoraddresses` (`donationBinOperatorAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `donationBinOperatorID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinoperatoraddresshistory`
--

INSERT INTO `donationbinoperatoraddresshistory` (`donationBinOperatorAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `donationBinOperatorID`, `donationBinOperatorAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:01:42', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinoperators`
--

INSERT INTO `donationbinoperators` (`donationBinOperatorID`, `firstName`, `lastName`, `phoneNumber`, `email`, `photoID`, `charityInformation`, `sitePlan`, `certificateOfInsurance`, `ownerConsent`, `donationBinID`) VALUES
(1, 'Bin', 'Operator', '123-123-1234', 'bin@operator.com', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinpropertyowneraddresses`
--

INSERT INTO `donationbinpropertyowneraddresses` (`donationBinPropertyOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `donationBinPropertyOwnerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinpropertyowneraddresshistory`
--

INSERT INTO `donationbinpropertyowneraddresshistory` (`donationBinPropertyOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `donationBinPropertyOwnerID`, `donationBinPropertyOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:01:06', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbinpropertyowners`
--

INSERT INTO `donationbinpropertyowners` (`donationBinPropertyOwnerID`, `firstName`, `lastName`, `phoneNumber`, `email`, `donationBinID`) VALUES
(1, 'Property', 'Owner', '123-123-1234', 'property@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `donationbins`
--

INSERT INTO `donationbins` (`donationBinID`, `licenseNumber`, `issueDate`, `expiryDate`, `itemsCollected`, `pickupSchedule`, `colour`, `material`, `notes`) VALUES
(1, 'ABC-123', '2022-08-01', '2022-08-02', '- Items Collected', 'Mon-Fri', 'Metal', 'Steel', '- Test Notes');

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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dropdownforms`
--

INSERT INTO `dropdownforms` (`dropdownFormID`, `formName`) VALUES
(10, 'Add Dog Form'),
(11, 'Edit Dog Form'),
(12, 'Edit Policy Form'),
(13, 'Street Names'),
(21, 'Add Donation Bin Operator Form'),
(27, 'Enforcement Officer Names'),
(29, 'Filtering Options'),
(30, 'Add Driver Taxi License Form'),
(31, 'POA Matters Form');

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
) ENGINE=InnoDB AUTO_INCREMENT=1201 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `dropdowns`
--

INSERT INTO `dropdowns` (`dropdownID`, `dropdownTitle`, `dropdownValue`, `isDisabled`, `dropdownFormID`) VALUES
(7, 'Policy Filtering Options', 'Policy Name', 0, NULL),
(8, 'Policy Filtering Options', 'Policy Number', 0, NULL),
(10, 'Tag Required Options', 'Deceased', 0, 11),
(11, 'Tag Required Options', 'Moved', 0, 11),
(12, 'Tag Required Options', 'Mail Returned', 0, 11),
(13, 'Status Options', 'Active', 0, 12),
(14, 'Status Options', 'Archive', 0, 12),
(15, 'Status Options', 'Draft', 0, 12),
(17, 'Category Options', 'Administrative Policy', 0, 12),
(18, 'Category Options', 'Corporate Policy', 0, 12),
(22, 'Authority Options', 'Council', 0, 12),
(23, 'Authority Options', 'Staff', 0, 12),
(24, 'Authority Options', 'CAO', 0, 12),
(25, 'Authority Options', 'Department Head', 0, 12),
(538, 'Street Names', 'ACORN LANE', 0, 13),
(539, 'Street Names', 'ADAMS STREET', 0, 13),
(540, 'Street Names', 'AGAR AVENUE', 0, 13),
(541, 'Street Names', 'AISHFORD ROAD', 0, 13),
(542, 'Street Names', 'ALLAN LANE', 0, 13),
(543, 'Street Names', 'AMBERWING LANDING', 0, 13),
(544, 'Street Names', 'ANDREWS DRIVE', 0, 13),
(545, 'Street Names', 'ANGELA STREET', 0, 13),
(546, 'Street Names', 'ARCHER AVENUE', 0, 13),
(547, 'Street Names', 'ARMSTRONG CRESCENT', 0, 13),
(548, 'Street Names', 'ARTESIAN INDUSTRIAL PARKWAY', 0, 13),
(549, 'Street Names', 'ARTHUR EVANS CRESCENT', 0, 13),
(550, 'Street Names', 'AVERILL COURT', 0, 13),
(551, 'Street Names', 'BACK STREET', 0, 13),
(552, 'Street Names', 'BALES LANE', 0, 13),
(553, 'Street Names', 'BANNERMAN DRIVE', 0, 13),
(554, 'Street Names', 'BARRIE STREET', 0, 13),
(555, 'Street Names', 'BARTRAM CRESCENT', 0, 13),
(556, 'Street Names', 'BEARSFIELD DRIVE', 0, 13),
(557, 'Street Names', 'BELFRY DRIVE', 0, 13),
(558, 'Street Names', 'BINGHAM STREET', 0, 13),
(559, 'Street Names', 'BLUE DASHER BOULEVARD', 0, 13),
(560, 'Street Names', 'BOOTH STREET', 0, 13),
(561, 'Street Names', 'BRADFORD STREET', 0, 13),
(562, 'Street Names', 'BREEZE DRIVE', 0, 13),
(563, 'Street Names', 'BRIDGE STREET', 0, 13),
(564, 'Street Names', 'BRITANNIA AVENUE', 0, 13),
(565, 'Street Names', 'BRONZE CRESCENT', 0, 13),
(566, 'Street Names', 'BROWNLEE DRIVE', 0, 13),
(567, 'Street Names', 'BROWN\'S LANE', 0, 13),
(568, 'Street Names', 'BUCE AVENUE', 0, 13),
(569, 'Street Names', 'CAMBRIDGE CRESCENT', 0, 13),
(570, 'Street Names', 'CANAL ROAD', 0, 13),
(571, 'Street Names', 'CARRINGTON PLACE', 0, 13),
(572, 'Street Names', 'CARTER STREET', 0, 13),
(573, 'Street Names', 'CASSELLS DRIVE', 0, 13),
(574, 'Street Names', 'CATANIA AVENUE', 0, 13),
(575, 'Street Names', 'CENTRE STREET', 0, 13),
(576, 'Street Names', 'CERSWELL DRIVE', 0, 13),
(577, 'Street Names', 'CHELSEA CRESCENT', 0, 13),
(578, 'Street Names', 'CHRISTINA CRESCENT', 0, 13),
(579, 'Street Names', 'CHURCH STREET', 0, 13),
(580, 'Street Names', 'CITRINE DRIVE', 0, 13),
(581, 'Street Names', 'COFFEY ROAD', 0, 13),
(582, 'Street Names', 'COLBORNE STREET', 0, 13),
(583, 'Street Names', 'COLLINGS AVENUE', 0, 13),
(584, 'Street Names', 'COMPTON CRESCENT', 0, 13),
(585, 'Street Names', 'CORWIN DRIVE', 0, 13),
(586, 'Street Names', 'COUNTRYSIDE COURT', 0, 13),
(587, 'Street Names', 'COUNTY ROAD 1', 0, 13),
(588, 'Street Names', 'COUNTY ROAD 27', 0, 13),
(589, 'Street Names', 'COUNTY ROAD 88', 0, 13),
(590, 'Street Names', 'COUSINS COURT', 0, 13),
(591, 'Street Names', 'COUSTEAU DRIVE', 0, 13),
(592, 'Street Names', 'CROOKED CREEK DRIVE', 0, 13),
(593, 'Street Names', 'CROSSLAND BOULEVARD', 0, 13),
(594, 'Street Names', 'CROWN CRESCENT', 0, 13),
(595, 'Street Names', 'CUMMINGS ROAD', 0, 13),
(596, 'Street Names', 'DANUBE LANE', 0, 13),
(597, 'Street Names', 'DAVEY BOULEVARD', 0, 13),
(598, 'Street Names', 'DAVID STREET', 0, 13),
(599, 'Street Names', 'DAVIS ROAD', 0, 13),
(600, 'Street Names', 'DAY STREET', 0, 13),
(601, 'Street Names', 'DEER RUN CRESCENT', 0, 13),
(602, 'Street Names', 'DEPEUTER CRESCENT', 0, 13),
(603, 'Street Names', 'DEVALD ROAD', 0, 13),
(604, 'Street Names', 'DISSETTE STREET', 0, 13),
(605, 'Street Names', 'DIXON ROAD', 0, 13),
(606, 'Street Names', 'DOCTOR\'S LANE', 0, 13),
(607, 'Street Names', 'DOWNY EMERALD DRIVE', 0, 13),
(608, 'Street Names', 'DRURY STREET', 0, 13),
(609, 'Street Names', 'EDWARD STREET', 0, 13),
(610, 'Street Names', 'ELDRIDGE STREET', 0, 13),
(611, 'Street Names', 'ELIZABETH STREET', 0, 13),
(612, 'Street Names', 'EMPIRE DRIVE', 0, 13),
(613, 'Street Names', 'END OF ROAD', 0, 13),
(614, 'Street Names', 'ESSA STREET', 0, 13),
(615, 'Street Names', 'EVANS AVENUE', 0, 13),
(616, 'Street Names', 'EVE COURT', 0, 13),
(617, 'Street Names', 'FAIRSIDE DRIVE', 0, 13),
(618, 'Street Names', 'FARIS STREET', 0, 13),
(619, 'Street Names', 'FLETCHER STREET', 0, 13),
(620, 'Street Names', 'FOX RUN LANE', 0, 13),
(621, 'Street Names', 'FRASER STREET', 0, 13),
(622, 'Street Names', 'FRED COOK DRIVE', 0, 13),
(623, 'Street Names', 'FREDERICK STREET', 0, 13),
(624, 'Street Names', 'GAPP LANE', 0, 13),
(625, 'Street Names', 'GARDINER DRIVE', 0, 13),
(626, 'Street Names', 'GEDDES STREET', 0, 13),
(627, 'Street Names', 'GIVEN ROAD', 0, 13),
(628, 'Street Names', 'GOLFVIEW BOULEVARD', 0, 13),
(629, 'Street Names', 'GORDON COURT', 0, 13),
(630, 'Street Names', 'GOSNEL CIRCLE', 0, 13),
(631, 'Street Names', 'GRANDVIEW CRESCENT', 0, 13),
(632, 'Street Names', 'GREEN DARNER TRAIL', 0, 13),
(633, 'Street Names', 'GRENCER ROAD', 0, 13),
(634, 'Street Names', 'GRES COURT', 0, 13),
(635, 'Street Names', 'GWILLIMBURY DRIVE', 0, 13),
(636, 'Street Names', 'HARMONY CIRCLE', 0, 13),
(637, 'Street Names', 'HAZEL STREET', 0, 13),
(638, 'Street Names', 'HEARN STREET', 0, 13),
(639, 'Street Names', 'HIGHLAND TERRACE', 0, 13),
(640, 'Street Names', 'HIGHWAY 400', 0, 13),
(641, 'Street Names', 'HIGHWAY 9', 0, 13),
(642, 'Street Names', 'HILLSVIEW ROAD', 0, 13),
(643, 'Street Names', 'HODGSON ROAD', 0, 13),
(644, 'Street Names', 'HOLLAND COURT', 0, 13),
(645, 'Street Names', 'HOLLAND STREET EAST', 0, 13),
(646, 'Street Names', 'HOLLAND STREET WEST', 0, 13),
(647, 'Street Names', 'HUDSON CRESCENT', 0, 13),
(648, 'Street Names', 'HULST DRIVE', 0, 13),
(649, 'Street Names', 'HURD STREET', 0, 13),
(650, 'Street Names', 'HURON LANE', 0, 13),
(651, 'Street Names', 'HWY 400 RAMP', 0, 13),
(652, 'Street Names', 'IMPERIAL CRESCENT', 0, 13),
(653, 'Street Names', 'INDUSTRIAL COURT', 0, 13),
(654, 'Street Names', 'INDUSTRIAL ROAD', 0, 13),
(655, 'Street Names', 'IRWIN PLACE', 0, 13),
(656, 'Street Names', 'JAMES STREET', 0, 13),
(657, 'Street Names', 'JANE STREET', 0, 13),
(658, 'Street Names', 'JAY STREET', 0, 13),
(659, 'Street Names', 'JENNIFER COURT', 0, 13),
(660, 'Street Names', 'JOHN STREET EAST', 0, 13),
(661, 'Street Names', 'JOHN STREET WEST', 0, 13),
(662, 'Street Names', 'JOSEPH STREET', 0, 13),
(663, 'Street Names', 'JULIE COURT', 0, 13),
(664, 'Street Names', 'KATHRYN COURT', 0, 13),
(665, 'Street Names', 'KEELE LANE', 0, 13),
(666, 'Street Names', 'KIDD STREET', 0, 13),
(667, 'Street Names', 'KILKENNY TRAIL', 0, 13),
(668, 'Street Names', 'KNEESHAW PLACE', 0, 13),
(669, 'Street Names', 'KULPIN AVENUE', 0, 13),
(670, 'Street Names', 'LALLIEN DRIVE', 0, 13),
(671, 'Street Names', 'LANGFORD BOULEVARD', 0, 13),
(672, 'Street Names', 'LAWNDALE COURT', 0, 13),
(673, 'Street Names', 'LEE AVENUE', 0, 13),
(674, 'Street Names', 'LEITH DRIVE', 0, 13),
(675, 'Street Names', 'LEONARD ROAD', 0, 13),
(676, 'Street Names', 'LINE 10', 0, 13),
(677, 'Street Names', 'LINE 11', 0, 13),
(678, 'Street Names', 'LINE 12', 0, 13),
(679, 'Street Names', 'LINE 13', 0, 13),
(680, 'Street Names', 'LINE 2', 0, 13),
(681, 'Street Names', 'LINE 3', 0, 13),
(682, 'Street Names', 'LINE 4', 0, 13),
(683, 'Street Names', 'LINE 5', 0, 13),
(684, 'Street Names', 'LINE 6', 0, 13),
(685, 'Street Names', 'LINE 7', 0, 13),
(686, 'Street Names', 'LINE 8', 0, 13),
(687, 'Street Names', 'LINE 9', 0, 13),
(688, 'Street Names', 'LONGVIEW DRIVE', 0, 13),
(689, 'Street Names', 'LOTTO LANE', 0, 13),
(690, 'Street Names', 'LOWES GATE', 0, 13),
(691, 'Street Names', 'LUXURY AVENUE', 0, 13),
(692, 'Street Names', 'LYNN STREET', 0, 13),
(693, 'Street Names', 'MAGANI AVENUE', 0, 13),
(694, 'Street Names', 'MANDALANE DRIVE', 0, 13),
(695, 'Street Names', 'MAPLE COURT', 0, 13),
(696, 'Street Names', 'MAPLEGROVE AVENUE', 0, 13),
(697, 'Street Names', 'MARTIN STREET', 0, 13),
(698, 'Street Names', 'MARY STREET', 0, 13),
(699, 'Street Names', 'MASON AVENUE', 0, 13),
(700, 'Street Names', 'MAURINO COURT', 0, 13),
(701, 'Street Names', 'MC CANN CRESCENT', 0, 13),
(702, 'Street Names', 'MC DONALD LANE', 0, 13),
(703, 'Street Names', 'MC KENZIE WAY', 0, 13),
(704, 'Street Names', 'MC KINSTRY ROAD', 0, 13),
(705, 'Street Names', 'MEADOWHAWK TRAIL', 0, 13),
(706, 'Street Names', 'MEADOWVIEW DRIVE', 0, 13),
(707, 'Street Names', 'MELBOURNE DRIVE', 0, 13),
(708, 'Street Names', 'METCALFE DRIVE', 0, 13),
(709, 'Street Names', 'MILLER PARK AVENUE', 0, 13),
(710, 'Street Names', 'MILLIGAN STREET', 0, 13),
(711, 'Street Names', 'MILLS COURT', 0, 13),
(712, 'Street Names', 'MOONEY STREET', 0, 13),
(713, 'Street Names', 'MOORE STREET', 0, 13),
(714, 'Street Names', 'MORO STREET', 0, 13),
(715, 'Street Names', 'MORRIS ROAD', 0, 13),
(716, 'Street Names', 'MULOCK DRIVE', 0, 13),
(717, 'Street Names', 'NATALE COURT', 0, 13),
(718, 'Street Names', 'NEILLY TERRACE', 0, 13),
(719, 'Street Names', 'NELSON STREET', 0, 13),
(720, 'Street Names', 'NOBLE DRIVE', 0, 13),
(721, 'Street Names', 'NORTHGATE DRIVE', 0, 13),
(722, 'Street Names', 'NOTTINGHAM FOREST ROAD', 0, 13),
(723, 'Street Names', 'ONDREY STREET', 0, 13),
(724, 'Street Names', 'ORR DRIVE', 0, 13),
(725, 'Street Names', 'ORSI AVENUE', 0, 13),
(726, 'Street Names', 'ORVILLE HAND COURT', 0, 13),
(727, 'Street Names', 'OSLER COURT', 0, 13),
(728, 'Street Names', 'OUTLOOK AVENUE', 0, 13),
(729, 'Street Names', 'PACE CRESCENT', 0, 13),
(730, 'Street Names', 'PARK ROAD', 0, 13),
(731, 'Street Names', 'PARKSIDE COURT', 0, 13),
(732, 'Street Names', 'PARKWOOD AVENUE', 0, 13),
(733, 'Street Names', 'PATRICIAN COURT', 0, 13),
(734, 'Street Names', 'PETERMAN LANE', 0, 13),
(735, 'Street Names', 'PINE HILL ROAD', 0, 13),
(736, 'Street Names', 'PORTER STREET', 0, 13),
(737, 'Street Names', 'PRINCE DRIVE', 0, 13),
(738, 'Street Names', 'PRIVATE DRIVE', 0, 13),
(739, 'Street Names', 'PRIVATE ENTRANCE', 0, 13),
(740, 'Street Names', 'PROFESSOR DAY DRIVE', 0, 13),
(741, 'Street Names', 'PUMPHOUSE ROAD', 0, 13),
(742, 'Street Names', 'QUEEN STREET', 0, 13),
(743, 'Street Names', 'RAK COURT', 0, 13),
(744, 'Street Names', 'REAGENS INDUSTRIAL PARKWAY', 0, 13),
(745, 'Street Names', 'REBECCA STREET', 0, 13),
(746, 'Street Names', 'REGENCY COURT', 0, 13),
(747, 'Street Names', 'REID ROAD', 0, 13),
(748, 'Street Names', 'RIVER ROAD', 0, 13),
(749, 'Street Names', 'ROGERS TRAIL', 0, 13),
(750, 'Street Names', 'ROUGHLEY STREET', 0, 13),
(751, 'Street Names', 'ROYAL COURT', 0, 13),
(752, 'Street Names', 'RUSSEL DRIVE', 0, 13),
(753, 'Street Names', 'RUTHERFORD ROAD', 0, 13),
(754, 'Street Names', 'SAINT AVENUE', 0, 13),
(755, 'Street Names', 'SCANLON AVENUE', 0, 13),
(756, 'Street Names', 'SCARLETT WAY', 0, 13),
(757, 'Street Names', 'SELBY CRESCENT', 0, 13),
(758, 'Street Names', 'SIDEROAD 10', 0, 13),
(759, 'Street Names', 'SIDEROAD 20', 0, 13),
(760, 'Street Names', 'SIDEROAD 5', 0, 13),
(761, 'Street Names', 'SIMCOE ROAD', 0, 13),
(762, 'Street Names', 'SMITH STREET', 0, 13),
(763, 'Street Names', 'SOUTHFIELD GATE', 0, 13),
(764, 'Street Names', 'SPENCE LANE', 0, 13),
(765, 'Street Names', 'STEWART CRESCENT', 0, 13),
(766, 'Street Names', 'STODDART COURT', 0, 13),
(767, 'Street Names', 'SUMMERLYN TRAIL', 0, 13),
(768, 'Street Names', 'SUNDRAGON TRAIL', 0, 13),
(769, 'Street Names', 'SUNRISE CIRCLE', 0, 13),
(770, 'Street Names', 'SUTHERLAND AVENUE', 0, 13),
(771, 'Street Names', 'TAYLOR COURT', 0, 13),
(772, 'Street Names', 'TECUMSETH CRESCENT', 0, 13),
(773, 'Street Names', 'TEMPORARY CONNECTION STREET', 0, 13),
(774, 'Street Names', 'THOMAS STREET', 0, 13),
(775, 'Street Names', 'THORNTON AVENUE', 0, 13),
(776, 'Street Names', 'TIGERTAIL CRESCENT', 0, 13),
(777, 'Street Names', 'TOLL ROAD', 0, 13),
(778, 'Street Names', 'TORNADO DRIVE', 0, 13),
(779, 'Street Names', 'TORONTO STREET', 0, 13),
(780, 'Street Names', 'TOWER COURT', 0, 13),
(781, 'Street Names', 'TOWNSEND AVENUE', 0, 13),
(782, 'Street Names', 'TRAILSIDE DRIVE', 0, 13),
(783, 'Street Names', 'TURNER COURT', 0, 13),
(784, 'Street Names', 'VALLEYVIEW CRESCENT', 0, 13),
(785, 'Street Names', 'VESELI COURT', 0, 13),
(786, 'Street Names', 'VILLAGE GREEN LANE', 0, 13),
(787, 'Street Names', 'VIPOND WAY', 0, 13),
(788, 'Street Names', 'VISTA DRIVE', 0, 13),
(789, 'Street Names', 'WALKER AVENUE', 0, 13),
(790, 'Street Names', 'WANDA STREET', 0, 13),
(791, 'Street Names', 'WATERTON WAY', 0, 13),
(792, 'Street Names', 'WEBBER ROAD', 0, 13),
(793, 'Street Names', 'WEIR STREET', 0, 13),
(794, 'Street Names', 'WEST PARK AVENUE', 0, 13),
(795, 'Street Names', 'WILLIAM STREET', 0, 13),
(796, 'Street Names', 'WIST ROAD', 0, 13),
(797, 'Street Names', 'WOOD CRESCENT', 0, 13),
(798, 'Street Names', 'WYMAN CRESCENT', 0, 13),
(799, 'Street Names', 'YONGE STREET', 0, 13),
(800, 'Street Names', 'ZIMA CRESCENT', 0, 13),
(801, 'Street Names', 'ZIMA PARKWAY', 0, 13),
(802, 'Street Names', 'DALE CRESCENT', 0, 13),
(803, 'Street Names', 'WEBB STREET', 0, 13),
(804, 'Street Names', 'BROUGHTON TERRACE', 0, 13),
(805, 'Street Names', 'NAYLOR DRIVE', 0, 13),
(806, 'Street Names', 'RICHARDSON CRESCENT', 0, 13),
(807, 'Street Names', 'LONG STREET', 0, 13),
(808, 'Street Names', 'WILSON DRIVE', 0, 13),
(809, 'Street Names', 'HOPKINS CRESCENT', 0, 13),
(810, 'Street Names', 'SLACK STREET', 0, 13),
(811, 'Street Names', 'BROOKVIEW DRIVE', 0, 13),
(812, 'Street Names', 'RIDGEVIEW COURT', 0, 13),
(813, 'Street Names', 'LIBERTY CRESCENT', 0, 13),
(814, 'Street Names', 'HERITAGE STREET', 0, 13),
(815, 'Street Names', 'ROMANELLI CRESCENT', 0, 13),
(816, 'Street Names', 'JEWELWING COURT', 0, 13),
(817, 'Street Names', 'WALLACE GATE', 0, 13),
(818, 'Street Names', 'MATTHEWSON AVENUE', 0, 13),
(819, 'Street Names', 'LUISA STREET', 0, 13),
(820, 'Street Names', 'WANDERING GLIDER TRAIL', 0, 13),
(821, 'Street Names', 'TYNDALL DRIVE', 0, 13),
(822, 'Street Names', 'STEVENSON CRESCENT', 0, 13),
(823, 'Street Names', 'AELICK COURT', 0, 13),
(824, 'Street Names', 'COLLIS DRIVE', 0, 13),
(825, 'Street Names', 'WILKE TRAIL', 0, 13),
(826, 'Street Names', 'MC DONNELL CRESCENT', 0, 13),
(827, 'Street Names', 'EASEMENT', 0, 13),
(828, 'Street Names', 'WALKWAY', 0, 13),
(829, 'Street Names', 'W.DYKIE COURT', 0, 13),
(830, 'Street Names', 'MILBY CRESCENT', 0, 13),
(831, 'Street Names', 'BOYD LANE', 0, 13),
(832, 'Street Names', 'TAUCAR GATE', 0, 13),
(833, 'Street Names', 'DANIELE CRESCENT', 0, 13),
(834, 'Street Names', 'ALGEO WAY', 0, 13),
(835, 'Street Names', 'CAYTON CRESCENT', 0, 13),
(836, 'Street Names', 'TUPLING STREET', 0, 13),
(837, 'Street Names', 'FORTIS CRESCENT', 0, 13),
(838, 'Street Names', 'BARROW AVENUE', 0, 13),
(839, 'Street Names', 'GIBSON CIRCLE', 0, 13),
(840, 'Street Names', 'INVERNESS WAY', 0, 13),
(841, 'Street Names', 'TAY STREET', 0, 13),
(842, 'Street Names', 'LANARK STREET', 0, 13),
(843, 'Street Names', 'LEWIS AVENUE', 0, 13),
(844, 'Street Names', 'ARMSON COURT', 0, 13),
(845, 'Street Names', 'JONKMAN BOULEVARD', 0, 13),
(846, 'Street Names', 'FERRAGINE CRESCENT', 0, 13),
(847, 'Street Names', 'TIBERINI WAY', 0, 13),
(848, 'Street Names', 'DIMORK COURT', 0, 13),
(849, 'Street Names', 'STEVENS GATE', 0, 13),
(850, 'Street Names', 'MEMORIAL COURT', 0, 13),
(851, 'Street Names', 'VETERANS STREET', 0, 13),
(852, 'Street Names', 'WESTLAKE CRESCENT', 0, 13),
(853, 'Street Names', 'MARSHVIEW BOULEVARD', 0, 13),
(1049, 'Months', 'January', 0, NULL),
(1050, 'Months', 'February', 0, NULL),
(1051, 'Months', 'March', 0, NULL),
(1052, 'Months', 'April', 0, NULL),
(1053, 'Months', 'May', 0, NULL),
(1054, 'Months', 'June', 0, NULL),
(1055, 'Months', 'July', 0, NULL),
(1056, 'Months', 'August', 0, NULL),
(1057, 'Months', 'September', 0, NULL),
(1058, 'Months', 'October', 0, NULL),
(1059, 'Months', 'November', 0, NULL),
(1060, 'Months', 'December', 0, NULL),
(1061, 'Years', '2015', 0, NULL),
(1062, 'Years', '2016', 0, NULL),
(1063, 'Years', '2017', 0, NULL),
(1064, 'Years', '2018', 0, NULL),
(1065, 'Years', '2019', 0, NULL),
(1066, 'Years', '2020', 0, NULL),
(1067, 'Years', '2021', 0, NULL),
(1068, 'Years', '2022', 0, NULL),
(1069, 'Years', '2023', 0, NULL),
(1076, 'Owner Filtering Options', 'Owner Name', 0, NULL),
(1078, 'Owner Filtering Options', 'Address', 0, NULL),
(1079, 'Owner Filtering Options', 'Email', 0, NULL),
(1080, 'Owner Filtering Options', 'Dog Tag Number', 0, NULL),
(1081, 'Owner Filtering Options', 'Additional Owner Name', 0, NULL),
(1082, 'Policy Filtering Options', 'Division', 0, NULL),
(1083, 'Adult Entertainment Filtering Options', 'Business Name', 0, NULL),
(1084, 'Adult Entertainment Filtering Options', 'Owner Name', 0, NULL),
(1085, 'Adult Entertainment Filtering Options', 'Contact Name', 0, NULL),
(1086, 'Adult Entertainment Filtering Options', 'Address', 0, NULL),
(1088, 'User Filtering Options', 'Employee Name', 0, NULL),
(1089, 'User Filtering Options', 'Email', 0, NULL),
(1090, 'Owner Filtering Options', 'Vendor', 0, NULL),
(1091, 'Procedure Filtering Options', 'Procedure Name', 0, NULL),
(1092, 'Guideline Filtering Options', 'Guideline Name', 0, NULL),
(1093, 'Vendor Options', 'Administration Office', 0, 10),
(1094, 'Vendor Options', 'BWG Leisure Centre', 0, 10),
(1095, 'Vendor Options', 'Online', 0, 10),
(1096, 'Vendor Options', 'Dissette Animal Hospital', 0, 10),
(1097, 'Vendor Options', 'Pet Valu', 0, 10),
(1098, 'Vendor Options', 'Roman Kennels', 0, 10),
(1099, 'Vendor Options', 'Summerlyn Pet Hospital', 0, 10),
(1100, 'Street Closure Permit Filtering Options', 'Sponser', 0, NULL),
(1101, 'Street Closure Permit Filtering Options', 'Closure Location', 0, NULL),
(1102, 'Organization Types', 'Charity', 0, 21),
(1103, 'Organization Types', 'Not-For-Profit', 0, 21),
(1104, 'Organization Types', 'For-Profit', 0, 21),
(1105, 'Donation Bin Filtering Options', 'Address', 0, NULL),
(1106, 'Donation Bin Filtering Options', 'Bin Operator Name', 0, NULL),
(1107, 'Donation Bin Filtering Options', 'Charity/Organization', 0, NULL),
(1108, 'Hawker & Peddler Filtering Options', 'Business Name', 0, NULL),
(1109, 'Hawker & Peddler Filtering Options', 'Applicant Name', 0, NULL),
(1110, 'Hawker & Peddler Filtering Options', 'Applicant Address', 0, NULL),
(1111, 'Kennel Filtering Options', 'Kennel Name', 0, NULL),
(1112, 'Kennel Filtering Options', 'Kennel Address', 0, NULL),
(1113, 'Kennel Filtering Options', 'Kennel Owner Name', 0, NULL),
(1114, 'Liquor Licensing Filtering Options', 'Business Name', 0, NULL),
(1115, 'Liquor Licensing Filtering Options', 'Business Address', 0, NULL),
(1116, 'Liquor Licensing Filtering Options', 'Contact Name', 0, NULL),
(1117, 'Refreshment Vehicle Filtering Options', 'Registered Business Name', 0, NULL),
(1118, 'Refreshment Vehicle Filtering Options', 'Operating Business Name', 0, NULL),
(1119, 'Refreshment Vehicle Filtering Options', 'Vehicle Owner Name', 0, NULL),
(1120, 'Officer Name', 'Brent Lee', 0, 27),
(1121, 'Officer Name', 'Lauren Fortune', 0, 27),
(1122, 'Officer Name', 'Igor Pogacevski', 0, 27),
(1123, 'Officer Name', 'Andrew Richardson', 0, 27),
(1124, 'Officer Name', 'Aneta Prytula', 0, 27),
(1125, 'Officer Name', 'Bryan McDonald', 0, 27),
(1126, 'Officer Name', 'Joey Furgiuele', 0, 27),
(1127, 'Officer Name', 'Marie Duquette', 0, 27),
(1128, 'Officer Name', 'Robert Belsey', 0, 27),
(1129, 'Officer Name', 'Spencer Smith', 0, 27),
(1130, 'POA Matters Filtering Options', 'Officer', 0, NULL),
(1131, 'Dog Owner Filtering Options', 'Owner Name', 0, NULL),
(1132, 'Dog Owner Filtering Options', 'Owner Name', 0, 29),
(1133, 'Dog Owner Filtering Options', 'Address', 0, 29),
(1134, 'Dog Owner Filtering Options', 'Email', 0, 29),
(1135, 'Dog Owner Filtering Options', 'Dog Tag Number', 0, 29),
(1136, 'Dog Owner Filtering Options', 'Additional Owner Name', 0, 29),
(1137, 'Dog Owner Filtering Options', 'Vendor', 0, 29),
(1138, 'Policy Filtering Options', 'Policy Name', 0, 29),
(1139, 'Policy Filtering Options', 'Policy Number', 0, 29),
(1140, 'Policy Filtering Options', 'Division', 0, 29),
(1141, 'Policy History Filtering Options - Months', 'January', 0, 29),
(1142, 'Policy History Filtering Options - Months', 'February', 0, 29),
(1143, 'Policy History Filtering Options - Months', 'March', 0, 29),
(1144, 'Policy History Filtering Options - Months', 'April', 0, 29),
(1145, 'Policy History Filtering Options - Months', 'May', 0, 29),
(1146, 'Policy History Filtering Options - Months', 'June', 0, 29),
(1147, 'Policy History Filtering Options - Months', 'July', 0, 29),
(1148, 'Policy History Filtering Options - Months', 'August', 0, 29),
(1149, 'Policy History Filtering Options - Months', 'September', 0, 29),
(1150, 'Policy History Filtering Options - Months', 'October', 0, 29),
(1151, 'Policy History Filtering Options - Months', 'November', 0, 29),
(1152, 'Policy History Filtering Options - Months', 'December', 0, 29),
(1153, 'Policy History Filtering Options - Years', '2015', 0, 29),
(1154, 'Policy History Filtering Options - Years', '2016', 0, 29),
(1155, 'Policy History Filtering Options - Years', '2017', 0, 29),
(1156, 'Policy History Filtering Options - Years', '2018', 0, 29),
(1157, 'Policy History Filtering Options - Years', '2019', 0, 29),
(1158, 'Policy History Filtering Options - Years', '2020', 0, 29),
(1159, 'Policy History Filtering Options - Years', '2021', 0, 29),
(1160, 'Policy History Filtering Options - Years', '2022', 0, 29),
(1161, 'Policy History Filtering Options - Years', '2023', 0, 29),
(1162, 'Policy History Filtering Options - Years', '2024', 0, 29),
(1163, 'Adult Entertainment Filtering Options', 'Business Name', 0, 29),
(1164, 'Adult Entertainment Filtering Options', 'Owner Name', 0, 29),
(1165, 'Adult Entertainment Filtering Options', 'Contact Name', 0, 29),
(1166, 'Adult Entertainment Filtering Options', 'Address', 0, 29),
(1167, 'Admin User List Filtering Options', 'Email', 0, 29),
(1168, 'Admin User List Filtering Options', 'Employee Name', 0, 29),
(1169, 'Procedure Filtering Options', 'Procedure Name', 0, 29),
(1170, 'Guideline Filtering Options', 'Guideline Name', 0, 29),
(1171, 'Street Closure Permit Filtering Options', 'Closure Location', 0, 29),
(1172, 'Street Closure Permit Filtering Options', 'Sponser', 0, 29),
(1173, 'Donation Bin Filtering Options', 'Charity/Organization', 0, 29),
(1174, 'Donation Bin Filtering Options', 'Bin Operator Name', 0, 29),
(1175, 'Donation Bin Filtering Options', 'Address', 0, 29),
(1176, 'Hawker & Peddler Filtering Options', 'Operator Address', 0, 29),
(1177, 'Hawker & Peddler Filtering Options', 'Operator Name', 0, 29),
(1178, 'Hawker & Peddler Filtering Options', 'Business Name', 0, 29),
(1179, 'Kennel Filtering Options', 'Kennel Owner Name', 0, 29),
(1180, 'Kennel Filtering Options', 'Kennel Address', 0, 29),
(1181, 'Kennel Filtering Options', 'Kennel Name', 0, 29),
(1182, 'Liquor Licensing Filtering Options', 'Contact Name', 0, 29),
(1183, 'Liquor Licensing Filtering Options', 'Business Address', 0, 29),
(1184, 'Liquor Licensing Filtering Options', 'Business Name', 0, 29),
(1185, 'Refreshment Vehicle Filtering Options', 'Vehicle Owner Name', 0, 29),
(1186, 'Refreshment Vehicle Filtering Options', 'Operating Business Name', 0, 29),
(1187, 'Refreshment Vehicle Filtering Options', 'Registered Business Name', 0, 29),
(1188, 'POA Matters Filtering Options', 'Officer Name', 0, 29),
(1189, 'POA Matters Filtering Options', 'Defendant Name', 0, 29),
(1190, 'POA Matters Filtering Options', 'Info Number', 0, 29),
(1191, 'POA Matters Filtering Options', 'Offence', 0, 29),
(1192, 'Cab Companies', 'Astro Taxi Inc.', 0, 30),
(1193, 'Cab Companies', 'BB Taxi', 0, 30),
(1194, 'Cab Companies', 'Newmarket Solo Taxi', 0, 30),
(1195, 'Cab Companies', 'Singh Taxi', 0, 30),
(1196, 'Cab Companies', 'Town Taxi', 0, 30),
(1197, 'Verdict Options', 'Guilty', 0, 31),
(1198, 'Verdict Options', 'Not-Guilty', 0, 31),
(1199, 'Taxi Filtering Options', 'Company Name', 0, 29),
(1200, 'Taxi Filtering Options', 'Owner Name', 0, 29);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `guidelinehistory`
--

INSERT INTO `guidelinehistory` (`guidelineHistoryID`, `action`, `guidelineNumber`, `guidelineName`, `dateApproved`, `lastReviewDate`, `scheduledReviewDate`, `dateAmended`, `status`, `category`, `division`, `authority`, `administrator`, `legislationRequired`, `fileHoldURL`, `notes`, `lastModified`, `policyID`, `guidelineID`) VALUES
(1, 'insert', 'ABC-123', 'Guideline Name', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Guideline', 'Test Division', 'Council', 'Test Administrator', 'Yes', '', '- Test Notes', '2022-08-30 14:21:40', 1, 1),
(2, 'insert', 'XYZ-123', 'Guideline Name Two', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Guideline', 'Test Division', 'Council', 'Test Administrator', 'Yes', '', '- Test Notes', '2022-08-30 14:24:10', NULL, 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `guidelines`
--

INSERT INTO `guidelines` (`guidelineID`, `guidelineNumber`, `guidelineName`, `dateApproved`, `lastReviewDate`, `scheduledReviewDate`, `dateAmended`, `status`, `category`, `division`, `authority`, `administrator`, `legislationRequired`, `fileHoldURL`, `notes`, `policyID`) VALUES
(1, 'ABC-123', 'Guideline Name', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Guideline', 'Test Division', 'Council', 'Test Administrator', 'Yes', '', '- Test Notes', 1),
(2, 'XYZ-123', 'Guideline Name Two', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Guideline', 'Test Division', 'Council', 'Test Administrator', 'Yes', '', '- Test Notes', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerapplicantaddresses`
--

INSERT INTO `hawkerpeddlerapplicantaddresses` (`hawkerPeddlerApplicantAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `hawkerPeddlerApplicantID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerapplicantaddresshistory`
--

INSERT INTO `hawkerpeddlerapplicantaddresshistory` (`hawkerPeddlerApplicantAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `hawkerPeddlerApplicantID`, `hawkerPeddlerApplicantAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:06:48', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerapplicants`
--

INSERT INTO `hawkerpeddlerapplicants` (`hawkerPeddlerApplicantID`, `firstName`, `lastName`, `phoneNumber`, `email`, `issueDate`, `expiryDate`, `licenseNumber`, `hawkerPeddlerBusinessID`) VALUES
(1, 'Test', 'Operator', '123-123-1234', 'test@operator.com', '2022-08-01', '2022-08-02', 'ABC-123', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerbusinessaddresses`
--

INSERT INTO `hawkerpeddlerbusinessaddresses` (`hawkerPeddlerBusinessAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `hawkerPeddlerBusinessID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerbusinessaddresshistory`
--

INSERT INTO `hawkerpeddlerbusinessaddresshistory` (`hawkerPeddlerBusinessAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `hawkerPeddlerBusinessID`, `hawkerPeddlerBusinessAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:05:35', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerbusinesses`
--

INSERT INTO `hawkerpeddlerbusinesses` (`hawkerPeddlerBusinessID`, `businessName`, `phoneNumber`, `email`, `itemsForSale`, `notes`, `policeVSC`, `photoID`, `sitePlan`, `zoningClearance`) VALUES
(1, 'Business Name', '123-123-1234', 'business@name.com', '- Items for sale', '- Test Notes', 'Yes', 'Yes', 'Yes', 'Yes');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddleroperatorhistory`
--

INSERT INTO `hawkerpeddleroperatorhistory` (`hawkerPeddlerOperatorHistoryID`, `action`, `firstName`, `lastName`, `phoneNumber`, `email`, `issueDate`, `expiryDate`, `licenseNumber`, `lastModified`, `hawkerPeddlerApplicantID`) VALUES
(1, 'insert', 'Test', 'Operator', '123-123-1234', 'test@operator.com', '2022-08-01', '2022-08-02', 'ABC-123', '2022-08-30 14:06:48', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerpropertyowneraddresses`
--

INSERT INTO `hawkerpeddlerpropertyowneraddresses` (`hawkerPeddlerPropertyOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `hawkerPeddlerPropertyOwnerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerpropertyowneraddresshistory`
--

INSERT INTO `hawkerpeddlerpropertyowneraddresshistory` (`hawkerPeddlerPropertyOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `hawkerPeddlerPropertyOwnerID`, `hawkerPeddlerPropertyOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:06:09', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `hawkerpeddlerpropertyowners`
--

INSERT INTO `hawkerpeddlerpropertyowners` (`hawkerPeddlerPropertyOwnerID`, `firstName`, `lastName`, `phoneNumber`, `email`, `hawkerPeddlerBusinessID`) VALUES
(1, 'Property', 'Owner', '123-123-1234', 'property@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kenneladdresses`
--

INSERT INTO `kenneladdresses` (`kennelAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `kennelID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kenneladdresshistory`
--

INSERT INTO `kenneladdresshistory` (`kennelAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `kennelID`, `kennelAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:08:21', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelhistory`
--

INSERT INTO `kennelhistory` (`kennelHistoryID`, `action`, `kennelName`, `issueDate`, `expiryDate`, `licenseNumber`, `phoneNumber`, `email`, `notes`, `policeCheck`, `photoID`, `zoningClearance`, `acoInspection`, `lastModified`, `kennelID`) VALUES
(1, 'insert', 'Kennel Name', '2022-08-01', '2022-08-02', 'ABC-123', '123-123-1234', 'kennel@name.com', '- Test Notes', 'Yes', 'Yes', 'Yes', 'Yes', '2022-08-30 14:08:21', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelowneraddresses`
--

INSERT INTO `kennelowneraddresses` (`kennelOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `kennelOwnerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelowneraddresshistory`
--

INSERT INTO `kennelowneraddresshistory` (`kennelOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `kennelOwnerID`, `kennelOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:09:20', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelowners`
--

INSERT INTO `kennelowners` (`kennelOwnerID`, `firstName`, `lastName`, `phoneNumber`, `email`, `kennelID`) VALUES
(1, 'Kennel', 'Owner', '123-123-1234', 'kennel@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelpropertyowneraddresses`
--

INSERT INTO `kennelpropertyowneraddresses` (`kennelPropertyOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `kennelPropertyOwnerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelpropertyowneraddresshistory`
--

INSERT INTO `kennelpropertyowneraddresshistory` (`kennelPropertyOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `kennelPropertyOwnerID`, `kennelPropertyOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:08:53', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennelpropertyowners`
--

INSERT INTO `kennelpropertyowners` (`kennelPropertyOwnerID`, `firstName`, `lastName`, `phoneNumber`, `email`, `kennelID`) VALUES
(1, 'Property', 'Owner', '123-123-1234', 'property@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `kennels`
--

INSERT INTO `kennels` (`kennelID`, `kennelName`, `issueDate`, `expiryDate`, `licenseNumber`, `phoneNumber`, `email`, `notes`, `policeCheck`, `photoID`, `zoningClearance`, `acoInspection`) VALUES
(1, 'Kennel Name', '2022-08-01', '2022-08-02', 'ABC-123', '123-123-1234', 'kennel@name.com', '- Test Notes', 'Yes', 'Yes', 'Yes', 'Yes');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `liquorbusinessaddresses`
--

INSERT INTO `liquorbusinessaddresses` (`liquorBusinessAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `liquorBusinessID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `liquorbusinessaddresshistory`
--

INSERT INTO `liquorbusinessaddresshistory` (`liquorBusinessAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `liquorBusinessID`, `liquorBusinessAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:10:08', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `liquorbusinesses`
--

INSERT INTO `liquorbusinesses` (`liquorBusinessID`, `businessName`, `businessPhone`, `contactName`, `contactPhone`, `dateStarted`, `applicationType`, `feeReceived`, `municipalInformationSigned`, `municipalInformationSentToAGCO`, `fireApprovalReceived`, `fireSentToAGCO`, `planningApprovalReceived`, `planningSentToAGCO`, `smdhuApprovalReceived`, `smdhuSentToAGCO`, `buildingApprovalReceived`, `buildingSentToAGCO`, `licenseApproved`, `notes`) VALUES
(1, 'Business Name', '123-123-1234', 'Contact Name', '123-123-1234', '2022-08-01', 'New', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `owners`
--

INSERT INTO `owners` (`ownerID`, `firstName`, `lastName`, `homePhone`, `cellPhone`, `workPhone`, `email`) VALUES
(1, 'Owner', 'Name', '', '123-123-1234', '', 'owner@name.com');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `poamatterlocations`
--

INSERT INTO `poamatterlocations` (`poaMatterLocationID`, `streetNumber`, `streetName`, `town`, `postalCode`, `poaMatterID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `poamatters`
--

INSERT INTO `poamatters` (`poaMatterID`, `infoNumber`, `dateOfOffence`, `dateClosed`, `officerName`, `defendantName`, `poaType`, `offence`, `setFine`, `fineAssessed`, `amountPaid`, `prosecutor`, `verdict`, `comment`, `tmpCol`) VALUES
(1, 'ABC-123', '2022-08-01', '2022-08-02', 'Officer Name', 'Defendant Name', 'Part 1', 'Offence description here', 250, 350, 350, 'Test Prosecutor', 'Guilty', '- Comments about the POA Matter', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `poamattertrials`
--

INSERT INTO `poamattertrials` (`poaMatterTrialID`, `trialDate`, `trialComment`, `poaMatterID`) VALUES
(1, '2022-08-01', 'Date One', 1),
(2, '2022-08-02', 'Date Two', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `policies`
--

INSERT INTO `policies` (`policyID`, `policyNumber`, `policyName`, `cowDate`, `councilResolution`, `dateApproved`, `dateAmended`, `dateEffective`, `category`, `lastReviewDate`, `scheduledReviewDate`, `division`, `authority`, `administrator`, `legislationRequired`, `status`, `fileHoldURL`, `notes`) VALUES
(1, 'ABC-123', 'Policy Name', '2022-08-01', 'Council Resolution', '2022-08-01', '2022-08-02', '2022-08-03', 'Administrative Policy', '2022-08-04', '2022-08-05', 'Test Division', 'Staff', 'Test Administrator', 'No', 'Active', '', '- Test Notes');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `policyhistory`
--

INSERT INTO `policyhistory` (`policyHistoryID`, `action`, `policyNumber`, `policyName`, `cowDate`, `councilResolution`, `dateApproved`, `dateAmended`, `dateEffective`, `category`, `lastReviewDate`, `scheduledReviewDate`, `division`, `authority`, `administrator`, `legislationRequired`, `status`, `fileHoldURL`, `notes`, `lastModified`, `policyID`) VALUES
(1, 'insert', 'ABC-123', 'Policy Name', '2022-08-01', 'Council Resolution', '2022-08-01', '2022-08-02', '2022-08-03', 'Administrative Policy', '2022-08-04', '2022-08-05', 'Test Division', 'Staff', 'Test Administrator', 'No', 'Active', '', '- Test Notes', '2022-08-30 14:19:18', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `procedurehistory`
--

INSERT INTO `procedurehistory` (`procedureHistoryID`, `action`, `procedureName`, `procedureNumber`, `dateApproved`, `lastReviewDate`, `scheduledReviewDate`, `dateAmended`, `status`, `category`, `division`, `authority`, `administrator`, `legislationRequired`, `fileHoldURL`, `notes`, `lastModified`, `policyID`, `procedureID`) VALUES
(1, 'insert', 'Procedure Name', 'ABC-123', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Procedure', 'Test Division', 'Staff', 'Test Administrator', 'Yes', '', '- Test Notes', '2022-08-30 14:21:04', 1, 1),
(2, 'insert', 'Procedure Name Two', 'XYZ-123', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Procedure', 'Test Division', 'Council', 'Test Administrator', 'Yes', '', '- Test Notes', '2022-08-30 14:23:00', NULL, 2);

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `procedures`
--

INSERT INTO `procedures` (`procedureID`, `procedureNumber`, `procedureName`, `dateApproved`, `lastReviewDate`, `scheduledReviewDate`, `dateAmended`, `status`, `category`, `division`, `authority`, `administrator`, `legislationRequired`, `fileHoldURL`, `notes`, `policyID`) VALUES
(1, 'ABC-123', 'Procedure Name', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Procedure', 'Test Division', 'Staff', 'Test Administrator', 'Yes', '', '- Test Notes', 1),
(2, 'XYZ-123', 'Procedure Name Two', '2022-08-01', '2022-08-03', '2022-08-04', '2022-08-02', 'Active', 'Procedure', 'Test Division', 'Council', 'Test Administrator', 'Yes', '', '- Test Notes', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `refreshmentvehiclehistory`
--

INSERT INTO `refreshmentvehiclehistory` (`refreshmentVehicleHistoryID`, `action`, `registeredBusinessName`, `operatingBusinessName`, `licenseNumber`, `issueDate`, `expiryDate`, `specialEvent`, `itemsForSale`, `notes`, `policeVSC`, `photoID`, `driversAbstract`, `safetyCertificate`, `vehicleOwnership`, `citizenship`, `insurance`, `fireApproval`, `zoningClearance`, `healthInspection`, `lastModified`, `refreshmentVehicleID`) VALUES
(1, 'insert', 'Registered Name', 'Operating Name', 'ABC-123', '2022-08-01', '2022-08-02', 'Yes', '- Items for sale', '- Test Notes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '2022-08-30 14:10:48', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicleoperatoraddresses`
--

INSERT INTO `refreshmentvehicleoperatoraddresses` (`refreshmentVehicleOperatorAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `refreshmentVehicleOperatorID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicleoperatoraddresshistory`
--

INSERT INTO `refreshmentvehicleoperatoraddresshistory` (`refreshmentVehicleOperatorAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `refreshmentVehicleOperatorID`, `refreshmentVehicleOperatorAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:12:14', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicleoperators`
--

INSERT INTO `refreshmentvehicleoperators` (`refreshmentVehicleOperatorID`, `firstName`, `lastName`, `phoneNumber`, `email`, `refreshmentVehicleID`) VALUES
(1, 'Vehicle', 'Operator', '123-123-1234', 'vehicle@operator.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicleowneraddresses`
--

INSERT INTO `refreshmentvehicleowneraddresses` (`refreshmentVehicleOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `refreshmentVehicleOwnerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicleowneraddresshistory`
--

INSERT INTO `refreshmentvehicleowneraddresshistory` (`refreshmentVehicleOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `refreshmentVehicleOwnerID`, `refreshmentVehicleOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:11:44', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicleowners`
--

INSERT INTO `refreshmentvehicleowners` (`refreshmentVehicleOwnerID`, `firstName`, `lastName`, `phoneNumber`, `email`, `refreshmentVehicleID`) VALUES
(1, 'Vehicle', 'Owner', '123-123-1234', 'vehicle@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehiclepropertyowneraddresses`
--

INSERT INTO `refreshmentvehiclepropertyowneraddresses` (`refreshmentVehiclePropertyOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `refreshmentVehiclePropertyOwnerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehiclepropertyowneraddresshistory`
--

INSERT INTO `refreshmentvehiclepropertyowneraddresshistory` (`refreshmentVehiclePropertyOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `refreshmentVehiclePropertyOwnerID`, `refreshmentVehiclePropertyOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:11:16', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehiclepropertyowners`
--

INSERT INTO `refreshmentvehiclepropertyowners` (`refreshmentVehiclePropertyOwnerID`, `firstName`, `lastName`, `phoneNumber`, `email`, `refreshmentVehicleID`) VALUES
(1, 'Property', 'Owner', '123-123-1234', 'property@owner.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `refreshmentvehicles`
--

INSERT INTO `refreshmentvehicles` (`refreshmentVehicleID`, `registeredBusinessName`, `operatingBusinessName`, `licenseNumber`, `issueDate`, `expiryDate`, `specialEvent`, `itemsForSale`, `notes`, `policeVSC`, `photoID`, `driversAbstract`, `safetyCertificate`, `vehicleOwnership`, `citizenship`, `insurance`, `fireApproval`, `zoningClearance`, `healthInspection`) VALUES
(1, 'Registered Name', 'Operating Name', 'ABC-123', '2022-08-01', '2022-08-02', 'Yes', '- Items for sale', '- Test Notes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes');

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `roleName`) VALUES
(1, 'Admin'),
(2, 'Policies'),
(3, 'Enforcement');

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

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`session_id`, `expires`, `data`) VALUES
('Pmo7vcFOSsZ7jEUJZasp9sugCUieo4MR', 1661912670, '{\"cookie\":{\"originalMaxAge\":28800000,\"expires\":\"2022-08-31T02:22:14.669Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":true},\"messages\":[],\"email\":\"bjonkman@townofbwg.com\",\"auth\":\"Admin,Policies,Enforcement\",\"donationBinID\":\"1\",\"ownerID\":\"1\",\"dogID\":\"1\",\"hawkerPeddlerBusinessID\":\"1\",\"kennelID\":\"1\",\"refreshmentVehicleID\":\"1\",\"brokerID\":\"1\"}'),
('ViBumqMhqMToXlLu4SG-C2gBxTWaJB-C', 1661891580, '{\"cookie\":{\"originalMaxAge\":28800000,\"expires\":\"2022-08-30T20:31:36.991Z\",\"httpOnly\":true,\"path\":\"/\",\"sameSite\":true},\"messages\":[],\"email\":\"BJonkman@townofbwg.com\",\"auth\":\"Admin,Policies,Enforcement\"}');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `streetclosurecontactaddresses`
--

INSERT INTO `streetclosurecontactaddresses` (`streetClosureContactAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `streetClosureContactID`, `streetClosurePermitID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `streetclosurecontacts`
--

INSERT INTO `streetclosurecontacts` (`streetClosureContactID`, `everydayContactName`, `everydayContactPhone`, `everydayContactEmail`, `streetClosurePermitID`) VALUES
(1, 'Everyday Contact Name', '123-123-1234', 'everyday@name.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `streetclosurecoordinatoraddresses`
--

INSERT INTO `streetclosurecoordinatoraddresses` (`streetClosureCoordinatorAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `streetClosureCoordinatorID`, `streetClosurePermitID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `streetclosurecoordinators`
--

INSERT INTO `streetclosurecoordinators` (`streetClosureCoordinatorID`, `coordinatorName`, `coordinatorPhone`, `coordinatorEmail`, `streetClosurePermitID`) VALUES
(1, 'Coordinator Name', '123-123-1234', 'cooridinator@name.com', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `streetclosurepermits`
--

INSERT INTO `streetclosurepermits` (`streetClosurePermitID`, `permitNumber`, `issueDate`, `sponser`, `closureLocation`, `closureDate`, `closureTime`, `description`, `noiseExemption`, `alcoholServed`, `estimatedAttendance`, `cleanupPlan`) VALUES
(1, 'ABC-123', '2022-08-01', 'Test Sponser', 'Closure Location', '2022-08-01', 'Closure Time', '- Test Description', 'No', 'No', 50, '- Cleanup Plan');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tagnumberhistory`
--

INSERT INTO `tagnumberhistory` (`tagNumberHistoryID`, `action`, `tagNumber`, `dogName`, `lastModified`, `dogID`, `ownerID`) VALUES
(1, 'insert', '1', 'Greenlee', '2022-08-30 14:04:02', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxibrokeraddresses`
--

INSERT INTO `taxibrokeraddresses` (`taxiBrokerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `taxiBrokerID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxibrokeraddresshistory`
--

INSERT INTO `taxibrokeraddresshistory` (`taxiBrokerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `taxiBrokerID`, `taxiBrokerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:12:57', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxibrokerhistory`
--

INSERT INTO `taxibrokerhistory` (`taxiBrokerHistoryID`, `action`, `ownerName`, `companyName`, `phoneNumber`, `licenseNumber`, `issueDate`, `expiryDate`, `policeVSC`, `citizenship`, `photoID`, `driversAbstract`, `certificateOfInsurance`, `zoningApproval`, `notes`, `lastModified`, `taxiBrokerID`) VALUES
(1, 'insert', 'Owner Name', 'Company Name', '123-123-1234', 'ABC-123', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes', '2022-08-30 14:12:57', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxibrokers`
--

INSERT INTO `taxibrokers` (`taxiBrokerID`, `ownerName`, `companyName`, `phoneNumber`, `licenseNumber`, `issueDate`, `expiryDate`, `policeVSC`, `citizenship`, `photoID`, `driversAbstract`, `certificateOfInsurance`, `zoningApproval`, `notes`) VALUES
(1, 'Owner Name', 'Company Name', '123-123-1234', 'ABC-123', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes');

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxidriveraddresses`
--

INSERT INTO `taxidriveraddresses` (`taxiDriverAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `taxiDriverID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxidriveraddresshistory`
--

INSERT INTO `taxidriveraddresshistory` (`taxiDriverAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `taxiDriverID`, `taxiDriverAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:13:40', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxidriverhistory`
--

INSERT INTO `taxidriverhistory` (`taxiDriverHistoryID`, `action`, `firstName`, `lastName`, `phoneNumber`, `cabCompany`, `issueDate`, `expiryDate`, `policeVSC`, `citizenship`, `photoID`, `driversAbstract`, `notes`, `lastModified`, `taxiDriverID`) VALUES
(1, 'insert', 'Driver', 'Name', '123-123-1234', 'Astro Taxi Inc.', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes', '2022-08-30 14:13:40', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxidrivers`
--

INSERT INTO `taxidrivers` (`taxiDriverID`, `firstName`, `lastName`, `phoneNumber`, `cabCompany`, `issueDate`, `expiryDate`, `policeVSC`, `citizenship`, `photoID`, `driversAbstract`, `notes`, `taxiBrokerID`) VALUES
(1, 'Driver', 'Name', '123-123-1234', 'Astro Taxi Inc.', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxiplatehistory`
--

INSERT INTO `taxiplatehistory` (`taxiPlateHistoryID`, `action`, `firstName`, `lastName`, `phoneNumber`, `email`, `townPlateNumber`, `vehicleYearMakeModel`, `provincialPlate`, `vin`, `issueDate`, `expiryDate`, `policeVSC`, `driversAbstract`, `photoID`, `safetyCertificate`, `byLawInspection`, `insurance`, `vehicleOwnership`, `notes`, `lastModified`, `taxiPlateID`) VALUES
(1, 'insert', 'Vehicle', 'Owner', '123-123-1234', 'vehicle@owner.com', 1, '2022 Test Car', 'ABCD-1234', 'XYZ-123', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes', '2022-08-30 14:15:08', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxiplateowneraddresses`
--

INSERT INTO `taxiplateowneraddresses` (`taxiPlateOwnerAddressID`, `streetNumber`, `streetName`, `town`, `postalCode`, `taxiPlateID`) VALUES
(1, 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxiplateowneraddresshistory`
--

INSERT INTO `taxiplateowneraddresshistory` (`taxiPlateOwnerAddressHistoryID`, `action`, `streetNumber`, `streetName`, `town`, `postalCode`, `lastModified`, `taxiPlateID`, `taxiPlateOwnerAddressID`) VALUES
(1, 'insert', 1, 'JONKMAN BOULEVARD', 'Bradford', 'L9S 2E5', '2022-08-30 14:15:08', 1, 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `taxiplates`
--

INSERT INTO `taxiplates` (`taxiPlateID`, `firstName`, `lastName`, `phoneNumber`, `email`, `townPlateNumber`, `vehicleYearMakeModel`, `provincialPlate`, `vin`, `issueDate`, `expiryDate`, `policeVSC`, `driversAbstract`, `photoID`, `safetyCertificate`, `byLawInspection`, `insurance`, `vehicleOwnership`, `notes`, `taxiBrokerID`) VALUES
(1, 'Vehicle', 'Owner', '123-123-1234', 'vehicle@owner.com', 1, '2022 Test Car', 'ABCD-1234', 'XYZ-123', '2022-08-01', '2022-08-02', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', 'Yes', '- Test Notes', 1);

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
) ENGINE=InnoDB AUTO_INCREMENT=73 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `userroles`
--

INSERT INTO `userroles` (`userRoleID`, `userId`, `roleId`) VALUES
(62, 1, 1),
(70, 1, 2),
(60, 1, 3),
(35, 2, 1),
(39, 2, 2),
(40, 2, 3),
(36, 3, 3),
(37, 4, 3),
(41, 5, 3),
(42, 6, 3),
(71, 7, 1),
(43, 7, 3),
(44, 8, 3),
(45, 9, 3),
(46, 10, 2),
(47, 11, 1),
(48, 11, 2),
(49, 11, 3),
(50, 12, 1),
(51, 12, 2),
(52, 12, 3),
(53, 13, 3),
(54, 14, 3),
(55, 15, 3),
(56, 16, 3),
(57, 17, 3),
(58, 18, 3),
(59, 19, 3),
(64, 20, 1),
(65, 20, 2),
(66, 20, 3),
(67, 21, 1),
(69, 21, 3);

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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `firstName`, `lastName`, `email`) VALUES
(1, 'Bobby', 'Jonkman', 'bjonkman@townofbwg.com'),
(2, 'Chris', 'Harbour', 'charbour@townofbwg.com'),
(3, 'Elena', 'Chisholm', 'echisholm@townofbwg.com'),
(4, 'Monica', 'Marques', 'momarques@townofbwg.com'),
(5, 'Brent', 'Lee', 'blee@townofbwg.com'),
(6, 'Tara', 'Reynolds', 'treynolds@townofbwg.com'),
(7, 'Lauren', 'Fortune', 'lfortune@townofbwg.com'),
(8, 'Rebecca', 'Murphy', 'rmurphy@townofbwg.com'),
(9, 'Igor', 'Pogacevski', 'ipogacevski@townofbwg.com'),
(10, 'Jen', 'Kinsella', 'jkinsella@townofbwg.com'),
(11, 'Kyle', 'Vlaming', 'kvlaming@townofbwg.com'),
(12, 'Alex', 'Ioannidis', 'aioannidis@townofbwg.com'),
(13, 'Andrew', 'Richardson', 'arichardson@townofbwg.com'),
(14, 'Aneta', 'Prytula', 'aprytula@townofbwg.com'),
(15, 'Bryan', 'McDonald', 'bmcdonald@townofbwg.com'),
(16, 'Joey', 'Furgiuele', 'jfurgiuele@townofbwg.com'),
(17, 'Marie', 'Duquette', 'mduquette@townofbwg.com'),
(18, 'Robert', 'Belsey', 'rbelsey@townofbwg.com'),
(19, 'Spencer', 'Smith', 'ssmith@townofbwg.com'),
(20, 'Marc', 'Soukup', 'msoukup@townofbwg.com'),
(21, 'Admin', 'Backup', 'it@townofbwg.com');

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
