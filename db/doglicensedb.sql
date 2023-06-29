-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 23, 2023 at 01:07 AM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

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
  `additionalOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `homePhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cellPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `workPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerID` int DEFAULT NULL,
  PRIMARY KEY (`additionalOwnerID`),
  KEY `ownerID` (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `addresses`
--

DROP TABLE IF EXISTS `addresses`;
CREATE TABLE IF NOT EXISTS `addresses` (
  `addressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poBoxAptRR` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerID` int DEFAULT NULL,
  PRIMARY KEY (`addressID`),
  KEY `ownerID` (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adopteddogs`
--

DROP TABLE IF EXISTS `adopteddogs`;
CREATE TABLE IF NOT EXISTS `adopteddogs` (
  `adoptedDogID` int NOT NULL AUTO_INCREMENT,
  `dogName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateOfAdoption` date DEFAULT NULL,
  `breed` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `colour` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('M','F') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`adoptedDogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adopteraddresses`
--

DROP TABLE IF EXISTS `adopteraddresses`;
CREATE TABLE IF NOT EXISTS `adopteraddresses` (
  `adopterAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adopterID` int DEFAULT NULL,
  PRIMARY KEY (`adopterAddressID`),
  KEY `adopterID` (`adopterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `adopters`
--

DROP TABLE IF EXISTS `adopters`;
CREATE TABLE IF NOT EXISTS `adopters` (
  `adopterID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `adoptedDogID` int DEFAULT NULL,
  PRIMARY KEY (`adopterID`),
  KEY `adoptedDogID` (`adoptedDogID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businessaddresses`
--

DROP TABLE IF EXISTS `businessaddresses`;
CREATE TABLE IF NOT EXISTS `businessaddresses` (
  `businessAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poBoxAptRR` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `businessID` int DEFAULT NULL,
  PRIMARY KEY (`businessAddressID`),
  KEY `businessID` (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businesses`
--

DROP TABLE IF EXISTS `businesses`;
CREATE TABLE IF NOT EXISTS `businesses` (
  `businessID` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `healthInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feePaid` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businessesaddresshistory`
--

DROP TABLE IF EXISTS `businessesaddresshistory`;
CREATE TABLE IF NOT EXISTS `businessesaddresshistory` (
  `businessAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poBoxAptRR` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `businessAddressID` int DEFAULT NULL,
  `businessID` int DEFAULT NULL,
  PRIMARY KEY (`businessAddressHistoryID`),
  KEY `businessAddressID` (`businessAddressID`),
  KEY `businessID` (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businesshistory`
--

DROP TABLE IF EXISTS `businesshistory`;
CREATE TABLE IF NOT EXISTS `businesshistory` (
  `businessHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `businessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `healthInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feePaid` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `businessID` int DEFAULT NULL,
  PRIMARY KEY (`businessHistoryID`),
  KEY `businessID` (`businessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dogs`
--

DROP TABLE IF EXISTS `dogs`;
CREATE TABLE IF NOT EXISTS `dogs` (
  `dogID` int NOT NULL AUTO_INCREMENT,
  `tagNumber` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dogName` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `breed` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `colour` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `gender` enum('M','F') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `designation` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `spade` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rabiesTagNumber` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rabiesExpiry` date DEFAULT NULL,
  `vetOffice` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `tagRequired` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `vendor` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerID` int DEFAULT NULL,
  PRIMARY KEY (`dogID`),
  KEY `ownerID` (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinaddresses`
--

DROP TABLE IF EXISTS `donationbinaddresses`;
CREATE TABLE IF NOT EXISTS `donationbinaddresses` (
  `donationBinAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donationBinID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinAddressID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinaddresshistory`
--

DROP TABLE IF EXISTS `donationbinaddresshistory`;
CREATE TABLE IF NOT EXISTS `donationbinaddresshistory` (
  `donationBinAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinID` int DEFAULT NULL,
  `donationBinAddressID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinAddressHistoryID`),
  KEY `donationBinID` (`donationBinID`),
  KEY `donationBinAddressID` (`donationBinAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbincharities`
--

DROP TABLE IF EXISTS `donationbincharities`;
CREATE TABLE IF NOT EXISTS `donationbincharities` (
  `donationBinCharityID` int NOT NULL AUTO_INCREMENT,
  `charityName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `registrationNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `organizationType` enum('Charity','Not-For-Profit','For-Profit') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donationBinID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinCharityID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinhistory`
--

DROP TABLE IF EXISTS `donationbinhistory`;
CREATE TABLE IF NOT EXISTS `donationbinhistory` (
  `donationBinHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `licenseNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `itemsCollected` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pickupSchedule` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `colour` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `material` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinHistoryID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinoperatoraddresses`
--

DROP TABLE IF EXISTS `donationbinoperatoraddresses`;
CREATE TABLE IF NOT EXISTS `donationbinoperatoraddresses` (
  `donationBinOperatorAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donationBinOperatorID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinOperatorAddressID`),
  KEY `donationBinOperatorID` (`donationBinOperatorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinoperatoraddresshistory`
--

DROP TABLE IF EXISTS `donationbinoperatoraddresshistory`;
CREATE TABLE IF NOT EXISTS `donationbinoperatoraddresshistory` (
  `donationBinOperatorAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinOperatorID` int DEFAULT NULL,
  `donationBinOperatorAddressID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinOperatorAddressHistoryID`),
  KEY `donationBinOperatorID` (`donationBinOperatorID`),
  KEY `donationBinOperatorAddressID` (`donationBinOperatorAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinoperators`
--

DROP TABLE IF EXISTS `donationbinoperators`;
CREATE TABLE IF NOT EXISTS `donationbinoperators` (
  `donationBinOperatorID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `charityInformation` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sitePlan` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `ownerConsent` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donationBinID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinOperatorID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinpropertyowneraddresses`
--

DROP TABLE IF EXISTS `donationbinpropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `donationbinpropertyowneraddresses` (
  `donationBinPropertyOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donationBinPropertyOwnerID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinPropertyOwnerAddressID`),
  KEY `donationBinPropertyOwnerID` (`donationBinPropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinpropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `donationbinpropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `donationbinpropertyowneraddresshistory` (
  `donationBinPropertyOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `donationBinPropertyOwnerID` int DEFAULT NULL,
  `donationBinPropertyOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinPropertyOwnerAddressHistoryID`),
  KEY `donationBinPropertyOwnerID` (`donationBinPropertyOwnerID`),
  KEY `donationBinPropertyOwnerAddressID` (`donationBinPropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbinpropertyowners`
--

DROP TABLE IF EXISTS `donationbinpropertyowners`;
CREATE TABLE IF NOT EXISTS `donationbinpropertyowners` (
  `donationBinPropertyOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `donationBinID` int DEFAULT NULL,
  PRIMARY KEY (`donationBinPropertyOwnerID`),
  KEY `donationBinID` (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donationbins`
--

DROP TABLE IF EXISTS `donationbins`;
CREATE TABLE IF NOT EXISTS `donationbins` (
  `donationBinID` int NOT NULL AUTO_INCREMENT,
  `licenseNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `itemsCollected` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pickupSchedule` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `colour` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `material` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`donationBinID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dropdownforms`
--

DROP TABLE IF EXISTS `dropdownforms`;
CREATE TABLE IF NOT EXISTS `dropdownforms` (
  `dropdownFormID` int NOT NULL AUTO_INCREMENT,
  `formName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`dropdownFormID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dropdowns`
--

DROP TABLE IF EXISTS `dropdowns`;
CREATE TABLE IF NOT EXISTS `dropdowns` (
  `dropdownID` int NOT NULL AUTO_INCREMENT,
  `dropdownTitle` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dropdownValue` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `isDisabled` tinyint(1) NOT NULL,
  `dropdownFormID` int DEFAULT NULL,
  PRIMARY KEY (`dropdownID`),
  KEY `dropdownFormID` (`dropdownFormID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guidelinehistory`
--

DROP TABLE IF EXISTS `guidelinehistory`;
CREATE TABLE IF NOT EXISTS `guidelinehistory` (
  `guidelineHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `guidelineNumber` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `guidelineName` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `division` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `authority` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `administrator` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legislationRequired` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileHoldURL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `policyID` int DEFAULT NULL,
  `guidelineID` int DEFAULT NULL,
  PRIMARY KEY (`guidelineHistoryID`),
  KEY `policyID` (`policyID`),
  KEY `guidelineID` (`guidelineID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `guidelines`
--

DROP TABLE IF EXISTS `guidelines`;
CREATE TABLE IF NOT EXISTS `guidelines` (
  `guidelineID` int NOT NULL AUTO_INCREMENT,
  `guidelineNumber` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `guidelineName` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `division` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `authority` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `administrator` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legislationRequired` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileHoldURL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policyID` int DEFAULT NULL,
  PRIMARY KEY (`guidelineID`),
  KEY `policyID` (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerapplicantaddresses`
--

DROP TABLE IF EXISTS `hawkerpeddlerapplicantaddresses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerapplicantaddresses` (
  `hawkerPeddlerApplicantAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hawkerPeddlerApplicantID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerApplicantAddressID`),
  KEY `hawkerPeddlerApplicantID` (`hawkerPeddlerApplicantID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerapplicantaddresshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerapplicantaddresshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerapplicantaddresshistory` (
  `hawkerPeddlerApplicantAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerApplicantID` int DEFAULT NULL,
  `hawkerPeddlerApplicantAddressID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerApplicantAddressHistoryID`),
  KEY `hawkerPeddlerApplicantID` (`hawkerPeddlerApplicantID`),
  KEY `hawkerPeddlerApplicantAddressID` (`hawkerPeddlerApplicantAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerapplicants`
--

DROP TABLE IF EXISTS `hawkerpeddlerapplicants`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerapplicants` (
  `hawkerPeddlerApplicantID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hawkerPeddlerBusinessID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerApplicantID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinessaddresses`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinessaddresses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinessaddresses` (
  `hawkerPeddlerBusinessAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hawkerPeddlerBusinessID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessAddressID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinessaddresshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinessaddresshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinessaddresshistory` (
  `hawkerPeddlerBusinessAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerBusinessID` int DEFAULT NULL,
  `hawkerPeddlerBusinessAddressID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessAddressHistoryID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`),
  KEY `hawkerPeddlerBusinessAddressID` (`hawkerPeddlerBusinessAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinesses`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinesses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinesses` (
  `hawkerPeddlerBusinessID` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `itemsForSale` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sitePlan` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerbusinesshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerbusinesshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerbusinesshistory` (
  `hawkerPeddlerBusinessHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `businessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `itemsForSale` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `sitePlan` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerBusinessID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerBusinessHistoryID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerpropertyowneraddresses`
--

DROP TABLE IF EXISTS `hawkerpeddlerpropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerpropertyowneraddresses` (
  `hawkerPeddlerPropertyOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hawkerPeddlerPropertyOwnerID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerPropertyOwnerAddressID`),
  KEY `hawkerPeddlerPropertyOwnerID` (`hawkerPeddlerPropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerpropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `hawkerpeddlerpropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerpropertyowneraddresshistory` (
  `hawkerPeddlerPropertyOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `hawkerPeddlerPropertyOwnerID` int DEFAULT NULL,
  `hawkerPeddlerPropertyOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerPropertyOwnerAddressHistoryID`),
  KEY `hawkerPeddlerPropertyOwnerID` (`hawkerPeddlerPropertyOwnerID`),
  KEY `hawkerPeddlerPropertyOwnerAddressID` (`hawkerPeddlerPropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `hawkerpeddlerpropertyowners`
--

DROP TABLE IF EXISTS `hawkerpeddlerpropertyowners`;
CREATE TABLE IF NOT EXISTS `hawkerpeddlerpropertyowners` (
  `hawkerPeddlerPropertyOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `hawkerPeddlerBusinessID` int DEFAULT NULL,
  PRIMARY KEY (`hawkerPeddlerPropertyOwnerID`),
  KEY `hawkerPeddlerBusinessID` (`hawkerPeddlerBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kenneladdresses`
--

DROP TABLE IF EXISTS `kenneladdresses`;
CREATE TABLE IF NOT EXISTS `kenneladdresses` (
  `kennelAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kennelID` int DEFAULT NULL,
  PRIMARY KEY (`kennelAddressID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kenneladdresshistory`
--

DROP TABLE IF EXISTS `kenneladdresshistory`;
CREATE TABLE IF NOT EXISTS `kenneladdresshistory` (
  `kennelAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelID` int DEFAULT NULL,
  `kennelAddressID` int DEFAULT NULL,
  PRIMARY KEY (`kennelAddressHistoryID`),
  KEY `kennelID` (`kennelID`),
  KEY `kennelAddressID` (`kennelAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelhistory`
--

DROP TABLE IF EXISTS `kennelhistory`;
CREATE TABLE IF NOT EXISTS `kennelhistory` (
  `kennelHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `kennelName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policeCheck` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acoInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelID` int DEFAULT NULL,
  PRIMARY KEY (`kennelHistoryID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelowneraddresses`
--

DROP TABLE IF EXISTS `kennelowneraddresses`;
CREATE TABLE IF NOT EXISTS `kennelowneraddresses` (
  `kennelOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kennelOwnerID` int DEFAULT NULL,
  PRIMARY KEY (`kennelOwnerAddressID`),
  KEY `kennelOwnerID` (`kennelOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelowneraddresshistory`
--

DROP TABLE IF EXISTS `kennelowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `kennelowneraddresshistory` (
  `kennelOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelOwnerID` int DEFAULT NULL,
  `kennelOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`kennelOwnerAddressHistoryID`),
  KEY `kennelOwnerID` (`kennelOwnerID`),
  KEY `kennelOwnerAddressID` (`kennelOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelowners`
--

DROP TABLE IF EXISTS `kennelowners`;
CREATE TABLE IF NOT EXISTS `kennelowners` (
  `kennelOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kennelID` int DEFAULT NULL,
  PRIMARY KEY (`kennelOwnerID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelpropertyowneraddresses`
--

DROP TABLE IF EXISTS `kennelpropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `kennelpropertyowneraddresses` (
  `kennelPropertyOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kennelPropertyOwnerID` int DEFAULT NULL,
  PRIMARY KEY (`kennelPropertyOwnerAddressID`),
  KEY `kennelPropertyOwnerID` (`kennelPropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelpropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `kennelpropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `kennelpropertyowneraddresshistory` (
  `kennelPropertyOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `kennelPropertyOwnerID` int DEFAULT NULL,
  `kennelPropertyOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`kennelPropertyOwnerAddressHistoryID`),
  KEY `kennelPropertyOwnerID` (`kennelPropertyOwnerID`),
  KEY `kennelPropertyOwnerAddressID` (`kennelPropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennelpropertyowners`
--

DROP TABLE IF EXISTS `kennelpropertyowners`;
CREATE TABLE IF NOT EXISTS `kennelpropertyowners` (
  `kennelPropertyOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `kennelID` int DEFAULT NULL,
  PRIMARY KEY (`kennelPropertyOwnerID`),
  KEY `kennelID` (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kennels`
--

DROP TABLE IF EXISTS `kennels`;
CREATE TABLE IF NOT EXISTS `kennels` (
  `kennelID` int NOT NULL AUTO_INCREMENT,
  `kennelName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policeCheck` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `acoInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`kennelID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `liquorbusinessaddresses`
--

DROP TABLE IF EXISTS `liquorbusinessaddresses`;
CREATE TABLE IF NOT EXISTS `liquorbusinessaddresses` (
  `liquorBusinessAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `liquorBusinessID` int DEFAULT NULL,
  PRIMARY KEY (`liquorBusinessAddressID`),
  KEY `liquorBusinessID` (`liquorBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `liquorbusinessaddresshistory`
--

DROP TABLE IF EXISTS `liquorbusinessaddresshistory`;
CREATE TABLE IF NOT EXISTS `liquorbusinessaddresshistory` (
  `liquorBusinessAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `liquorBusinessID` int DEFAULT NULL,
  `liquorBusinessAddressID` int DEFAULT NULL,
  PRIMARY KEY (`liquorBusinessAddressHistoryID`),
  KEY `liquorBusinessID` (`liquorBusinessID`),
  KEY `liquorBusinessAddressID` (`liquorBusinessAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `liquorbusinesses`
--

DROP TABLE IF EXISTS `liquorbusinesses`;
CREATE TABLE IF NOT EXISTS `liquorbusinesses` (
  `liquorBusinessID` int NOT NULL AUTO_INCREMENT,
  `businessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `businessPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `contactPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateStarted` date DEFAULT NULL,
  `applicationType` enum('New','Amendment') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `feeReceived` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `municipalInformationSigned` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `municipalInformationSentToAGCO` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fireApprovalReceived` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fireSentToAGCO` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `planningApprovalReceived` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `planningSentToAGCO` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `smdhuApprovalReceived` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `smdhuSentToAGCO` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `buildingApprovalReceived` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `buildingSentToAGCO` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseApproved` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`liquorBusinessID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `owners`
--

DROP TABLE IF EXISTS `owners`;
CREATE TABLE IF NOT EXISTS `owners` (
  `ownerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `homePhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cellPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `workPhone` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`ownerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `poamatterlocations`
--

DROP TABLE IF EXISTS `poamatterlocations`;
CREATE TABLE IF NOT EXISTS `poamatterlocations` (
  `poaMatterLocationID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poaMatterID` int DEFAULT NULL,
  PRIMARY KEY (`poaMatterLocationID`),
  KEY `poaMatterID` (`poaMatterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `poamatters`
--

DROP TABLE IF EXISTS `poamatters`;
CREATE TABLE IF NOT EXISTS `poamatters` (
  `poaMatterID` int NOT NULL AUTO_INCREMENT,
  `infoNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateOfOffence` date DEFAULT NULL,
  `dateClosed` date DEFAULT NULL,
  `officerName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `defendantName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poaType` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `offence` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `setFine` int DEFAULT NULL,
  `fineAssessed` int DEFAULT NULL,
  `amountPaid` int DEFAULT NULL,
  `prosecutor` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `verdict` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `comment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`poaMatterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `poamattertrials`
--

DROP TABLE IF EXISTS `poamattertrials`;
CREATE TABLE IF NOT EXISTS `poamattertrials` (
  `poaMatterTrialID` int NOT NULL AUTO_INCREMENT,
  `trialDate` date DEFAULT NULL,
  `trialComment` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `poaMatterID` int DEFAULT NULL,
  PRIMARY KEY (`poaMatterTrialID`),
  KEY `poaMatterID` (`poaMatterID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `policies`
--

DROP TABLE IF EXISTS `policies`;
CREATE TABLE IF NOT EXISTS `policies` (
  `policyID` int NOT NULL AUTO_INCREMENT,
  `policyNumber` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policyName` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cowDate` date DEFAULT NULL,
  `councilResolution` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `dateEffective` date DEFAULT NULL,
  `category` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `division` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `authority` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `administrator` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legislationRequired` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Archive','Active','Draft') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileHoldURL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `policyhistory`
--

DROP TABLE IF EXISTS `policyhistory`;
CREATE TABLE IF NOT EXISTS `policyhistory` (
  `policyHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `policyNumber` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policyName` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cowDate` date DEFAULT NULL,
  `councilResolution` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `dateEffective` date DEFAULT NULL,
  `category` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `division` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `authority` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `administrator` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legislationRequired` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('Archive','Active','Draft') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileHoldURL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `policyID` int DEFAULT NULL,
  PRIMARY KEY (`policyHistoryID`),
  KEY `policyID` (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `procedurehistory`
--

DROP TABLE IF EXISTS `procedurehistory`;
CREATE TABLE IF NOT EXISTS `procedurehistory` (
  `procedureHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `procedureName` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `procedureNumber` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `division` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `authority` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `administrator` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legislationRequired` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileHoldURL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `policyID` int DEFAULT NULL,
  `procedureID` int DEFAULT NULL,
  PRIMARY KEY (`procedureHistoryID`),
  KEY `policyID` (`policyID`),
  KEY `procedureID` (`procedureID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `procedures`
--

DROP TABLE IF EXISTS `procedures`;
CREATE TABLE IF NOT EXISTS `procedures` (
  `procedureID` int NOT NULL AUTO_INCREMENT,
  `procedureNumber` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `procedureName` varchar(80) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dateApproved` date DEFAULT NULL,
  `lastReviewDate` date DEFAULT NULL,
  `scheduledReviewDate` date DEFAULT NULL,
  `dateAmended` date DEFAULT NULL,
  `status` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `category` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `division` varchar(45) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `authority` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `administrator` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `legislationRequired` varchar(5) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fileHoldURL` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policyID` int DEFAULT NULL,
  PRIMARY KEY (`procedureID`),
  KEY `policyID` (`policyID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclehistory`
--

DROP TABLE IF EXISTS `refreshmentvehiclehistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclehistory` (
  `refreshmentVehicleHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `registeredBusinessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `operatingBusinessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `specialEvent` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `itemsForSale` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizenship` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `insurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fireApproval` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `healthInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehicleID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleHistoryID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleoperatoraddresses`
--

DROP TABLE IF EXISTS `refreshmentvehicleoperatoraddresses`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleoperatoraddresses` (
  `refreshmentVehicleOperatorAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refreshmentVehicleOperatorID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOperatorAddressID`),
  KEY `refreshmentVehicleOperatorID` (`refreshmentVehicleOperatorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleoperatoraddresshistory`
--

DROP TABLE IF EXISTS `refreshmentvehicleoperatoraddresshistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleoperatoraddresshistory` (
  `refreshmentVehicleOperatorAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehicleOperatorID` int DEFAULT NULL,
  `refreshmentVehicleOperatorAddressID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOperatorAddressHistoryID`),
  KEY `refreshmentVehicleOperatorID` (`refreshmentVehicleOperatorID`),
  KEY `refreshmentVehicleOperatorAddressID` (`refreshmentVehicleOperatorAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleoperators`
--

DROP TABLE IF EXISTS `refreshmentvehicleoperators`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleoperators` (
  `refreshmentVehicleOperatorID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refreshmentVehicleID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOperatorID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleowneraddresses`
--

DROP TABLE IF EXISTS `refreshmentvehicleowneraddresses`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleowneraddresses` (
  `refreshmentVehicleOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refreshmentVehicleOwnerID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOwnerAddressID`),
  KEY `refreshmentVehicleOwnerID` (`refreshmentVehicleOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleowneraddresshistory`
--

DROP TABLE IF EXISTS `refreshmentvehicleowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleowneraddresshistory` (
  `refreshmentVehicleOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehicleOwnerID` int DEFAULT NULL,
  `refreshmentVehicleOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOwnerAddressHistoryID`),
  KEY `refreshmentVehicleOwnerID` (`refreshmentVehicleOwnerID`),
  KEY `refreshmentVehicleOwnerAddressID` (`refreshmentVehicleOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicleowners`
--

DROP TABLE IF EXISTS `refreshmentvehicleowners`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicleowners` (
  `refreshmentVehicleOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refreshmentVehicleID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleOwnerID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclepropertyowneraddresses`
--

DROP TABLE IF EXISTS `refreshmentvehiclepropertyowneraddresses`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclepropertyowneraddresses` (
  `refreshmentVehiclePropertyOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refreshmentVehiclePropertyOwnerID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehiclePropertyOwnerAddressID`),
  KEY `refreshmentVehiclePropertyOwnerID` (`refreshmentVehiclePropertyOwnerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclepropertyowneraddresshistory`
--

DROP TABLE IF EXISTS `refreshmentvehiclepropertyowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclepropertyowneraddresshistory` (
  `refreshmentVehiclePropertyOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `refreshmentVehiclePropertyOwnerID` int DEFAULT NULL,
  `refreshmentVehiclePropertyOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehiclePropertyOwnerAddressHistoryID`),
  KEY `refreshmentVehiclePropertyOwnerID` (`refreshmentVehiclePropertyOwnerID`),
  KEY `refreshmentVehiclePropertyOwnerAddressID` (`refreshmentVehiclePropertyOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehiclepropertyowners`
--

DROP TABLE IF EXISTS `refreshmentvehiclepropertyowners`;
CREATE TABLE IF NOT EXISTS `refreshmentvehiclepropertyowners` (
  `refreshmentVehiclePropertyOwnerID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `refreshmentVehicleID` int DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehiclePropertyOwnerID`),
  KEY `refreshmentVehicleID` (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `refreshmentvehicles`
--

DROP TABLE IF EXISTS `refreshmentvehicles`;
CREATE TABLE IF NOT EXISTS `refreshmentvehicles` (
  `refreshmentVehicleID` int NOT NULL AUTO_INCREMENT,
  `registeredBusinessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `operatingBusinessName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `specialEvent` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `itemsForSale` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizenship` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `insurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `fireApproval` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningClearance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `healthInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`refreshmentVehicleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE IF NOT EXISTS `roles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `roleName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecontactaddresses`
--

DROP TABLE IF EXISTS `streetclosurecontactaddresses`;
CREATE TABLE IF NOT EXISTS `streetclosurecontactaddresses` (
  `streetClosureContactAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `streetClosureContactID` int DEFAULT NULL,
  `streetClosurePermitID` int DEFAULT NULL,
  PRIMARY KEY (`streetClosureContactAddressID`),
  KEY `streetClosureContactID` (`streetClosureContactID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecontacts`
--

DROP TABLE IF EXISTS `streetclosurecontacts`;
CREATE TABLE IF NOT EXISTS `streetclosurecontacts` (
  `streetClosureContactID` int NOT NULL AUTO_INCREMENT,
  `everydayContactName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `everydayContactPhone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `everydayContactEmail` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `streetClosurePermitID` int DEFAULT NULL,
  PRIMARY KEY (`streetClosureContactID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecoordinatoraddresses`
--

DROP TABLE IF EXISTS `streetclosurecoordinatoraddresses`;
CREATE TABLE IF NOT EXISTS `streetclosurecoordinatoraddresses` (
  `streetClosureCoordinatorAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `streetClosureCoordinatorID` int DEFAULT NULL,
  `streetClosurePermitID` int DEFAULT NULL,
  PRIMARY KEY (`streetClosureCoordinatorAddressID`),
  KEY `streetClosureCoordinatorID` (`streetClosureCoordinatorID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurecoordinators`
--

DROP TABLE IF EXISTS `streetclosurecoordinators`;
CREATE TABLE IF NOT EXISTS `streetclosurecoordinators` (
  `streetClosureCoordinatorID` int NOT NULL AUTO_INCREMENT,
  `coordinatorName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinatorPhone` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `coordinatorEmail` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `streetClosurePermitID` int DEFAULT NULL,
  PRIMARY KEY (`streetClosureCoordinatorID`),
  KEY `streetClosurePermitID` (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `streetclosurepermits`
--

DROP TABLE IF EXISTS `streetclosurepermits`;
CREATE TABLE IF NOT EXISTS `streetclosurepermits` (
  `streetClosurePermitID` int NOT NULL AUTO_INCREMENT,
  `permitNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `sponser` varchar(75) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `closureLocation` varchar(75) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `closureDate` date DEFAULT NULL,
  `closureTime` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `noiseExemption` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `alcoholServed` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `estimatedAttendance` int DEFAULT NULL,
  `cleanupPlan` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`streetClosurePermitID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokeraddresses`
--

DROP TABLE IF EXISTS `taxibrokeraddresses`;
CREATE TABLE IF NOT EXISTS `taxibrokeraddresses` (
  `taxiBrokerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `taxiBrokerID` int DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerAddressID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokeraddresshistory`
--

DROP TABLE IF EXISTS `taxibrokeraddresshistory`;
CREATE TABLE IF NOT EXISTS `taxibrokeraddresshistory` (
  `taxiBrokerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiBrokerID` int DEFAULT NULL,
  `taxiBrokerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerAddressHistoryID`),
  KEY `taxiBrokerID` (`taxiBrokerID`),
  KEY `taxiBrokerAddressID` (`taxiBrokerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokerhistory`
--

DROP TABLE IF EXISTS `taxibrokerhistory`;
CREATE TABLE IF NOT EXISTS `taxibrokerhistory` (
  `taxiBrokerHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `ownerName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companyName` varchar(75) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizenship` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningApproval` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiBrokerID` int DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerHistoryID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxibrokers`
--

DROP TABLE IF EXISTS `taxibrokers`;
CREATE TABLE IF NOT EXISTS `taxibrokers` (
  `taxiBrokerID` int NOT NULL AUTO_INCREMENT,
  `ownerName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `companyName` varchar(75) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `licenseNumber` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizenship` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `certificateOfInsurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `zoningApproval` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxidriveraddresses`
--

DROP TABLE IF EXISTS `taxidriveraddresses`;
CREATE TABLE IF NOT EXISTS `taxidriveraddresses` (
  `taxiDriverAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `taxiDriverID` int DEFAULT NULL,
  PRIMARY KEY (`taxiDriverAddressID`),
  KEY `taxiDriverID` (`taxiDriverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxidriveraddresshistory`
--

DROP TABLE IF EXISTS `taxidriveraddresshistory`;
CREATE TABLE IF NOT EXISTS `taxidriveraddresshistory` (
  `taxiDriverAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiDriverID` int DEFAULT NULL,
  `taxiDriverAddressID` int DEFAULT NULL,
  PRIMARY KEY (`taxiDriverAddressHistoryID`),
  KEY `taxiDriverID` (`taxiDriverID`),
  KEY `taxiDriverAddressID` (`taxiDriverAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxidriverhistory`
--

DROP TABLE IF EXISTS `taxidriverhistory`;
CREATE TABLE IF NOT EXISTS `taxidriverhistory` (
  `taxiDriverHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cabCompany` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizenship` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiDriverID` int DEFAULT NULL,
  PRIMARY KEY (`taxiDriverHistoryID`),
  KEY `taxiDriverID` (`taxiDriverID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxidrivers`
--

DROP TABLE IF EXISTS `taxidrivers`;
CREATE TABLE IF NOT EXISTS `taxidrivers` (
  `taxiDriverID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `cabCompany` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `citizenship` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `taxiBrokerID` int DEFAULT NULL,
  PRIMARY KEY (`taxiDriverID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplatehistory`
--

DROP TABLE IF EXISTS `taxiplatehistory`;
CREATE TABLE IF NOT EXISTS `taxiplatehistory` (
  `taxiPlateHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `townPlateNumber` int DEFAULT NULL,
  `vehicleYearMakeModel` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `provincialPlate` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vin` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `byLawInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `insurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiPlateID` int DEFAULT NULL,
  PRIMARY KEY (`taxiPlateHistoryID`),
  KEY `taxiPlateID` (`taxiPlateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplateowneraddresses`
--

DROP TABLE IF EXISTS `taxiplateowneraddresses`;
CREATE TABLE IF NOT EXISTS `taxiplateowneraddresses` (
  `taxiPlateOwnerAddressID` int NOT NULL AUTO_INCREMENT,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `taxiPlateID` int DEFAULT NULL,
  PRIMARY KEY (`taxiPlateOwnerAddressID`),
  KEY `taxiPlateID` (`taxiPlateID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplateowneraddresshistory`
--

DROP TABLE IF EXISTS `taxiplateowneraddresshistory`;
CREATE TABLE IF NOT EXISTS `taxiplateowneraddresshistory` (
  `taxiPlateOwnerAddressHistoryID` int NOT NULL AUTO_INCREMENT,
  `action` varchar(20) COLLATE utf8mb4_general_ci NOT NULL,
  `streetNumber` int DEFAULT NULL,
  `streetName` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `town` varchar(30) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `postalCode` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastModified` datetime DEFAULT NULL,
  `taxiPlateID` int DEFAULT NULL,
  `taxiPlateOwnerAddressID` int DEFAULT NULL,
  PRIMARY KEY (`taxiPlateOwnerAddressHistoryID`),
  KEY `taxiPlateID` (`taxiPlateID`),
  KEY `taxiPlateOwnerAddressID` (`taxiPlateOwnerAddressID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `taxiplates`
--

DROP TABLE IF EXISTS `taxiplates`;
CREATE TABLE IF NOT EXISTS `taxiplates` (
  `taxiPlateID` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `phoneNumber` varchar(15) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `townPlateNumber` int DEFAULT NULL,
  `vehicleYearMakeModel` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `provincialPlate` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vin` varchar(40) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `issueDate` date DEFAULT NULL,
  `expiryDate` date DEFAULT NULL,
  `policeVSC` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `driversAbstract` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `photoID` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `safetyCertificate` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `byLawInspection` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `insurance` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `vehicleOwnership` enum('Yes','No') COLLATE utf8mb4_general_ci DEFAULT NULL,
  `notes` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `taxiBrokerID` int DEFAULT NULL,
  PRIMARY KEY (`taxiPlateID`),
  KEY `taxiBrokerID` (`taxiBrokerID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `userroles`
--

DROP TABLE IF EXISTS `userroles`;
CREATE TABLE IF NOT EXISTS `userroles` (
  `userRoleID` int NOT NULL AUTO_INCREMENT,
  `userId` int DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  PRIMARY KEY (`userRoleID`),
  UNIQUE KEY `userroles_roleId_userId_unique` (`userId`,`roleId`),
  KEY `roleId` (`roleId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `firstName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lastName` varchar(25) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
-- Constraints for table `adopteraddresses`
--
ALTER TABLE `adopteraddresses`
  ADD CONSTRAINT `adopteraddresses_ibfk_1` FOREIGN KEY (`adopterID`) REFERENCES `adopters` (`adopterID`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `adopters`
--
ALTER TABLE `adopters`
  ADD CONSTRAINT `adopters_ibfk_1` FOREIGN KEY (`adoptedDogID`) REFERENCES `adopteddogs` (`adoptedDogID`) ON DELETE SET NULL ON UPDATE CASCADE;

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
  ADD CONSTRAINT `dropdowns_ibfk_1` FOREIGN KEY (`dropdownFormID`) REFERENCES `dropdownforms` (`dropdownFormID`) ON DELETE SET NULL ON UPDATE CASCADE;

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
-- Constraints for table `hawkerpeddlerbusinesshistory`
--
ALTER TABLE `hawkerpeddlerbusinesshistory`
  ADD CONSTRAINT `hawkerpeddlerbusinesshistory_ibfk_1` FOREIGN KEY (`hawkerPeddlerBusinessID`) REFERENCES `hawkerpeddlerbusinesses` (`hawkerPeddlerBusinessID`) ON DELETE SET NULL ON UPDATE CASCADE;

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
  ADD CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
