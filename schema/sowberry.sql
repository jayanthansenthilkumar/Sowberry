-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 15, 2026 at 02:55 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sowberry`
--

-- --------------------------------------------------------

--
-- Table structure for table `activitylogs`
--

CREATE TABLE `activitylogs` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `action` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `activitylogs`
--

INSERT INTO `activitylogs` (`id`, `userId`, `action`, `description`, `ipAddress`, `createdAt`) VALUES
(1, 1, 'login', 'admin login: Sowmiya Admin', '::1', '2026-02-15 07:06:27'),
(2, 1, 'login', 'admin login: Sowmiya Admin', '::1', '2026-02-15 08:07:09'),
(3, 5, 'login', 'student login: Aarav Kumar', '::1', '2026-02-15 08:09:41'),
(4, 2, 'login', 'mentor login: Jayanthan S', '::1', '2026-02-15 08:14:26'),
(5, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 08:19:52'),
(6, 5, 'login', 'student login: Aarav Kumar', '::1', '2026-02-15 08:21:15'),
(7, 10, 'register', 'New student registration: Jayanthan S', NULL, '2026-02-15 08:22:17'),
(8, 10, 'login', 'student login: Jayanthan S', '::1', '2026-02-15 08:22:39'),
(9, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 10:05:27'),
(10, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 10:52:21'),
(11, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 10:53:01'),
(12, 10, 'login', 'student login: Jayanthan S', '::1', '2026-02-15 10:55:56'),
(13, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 10:56:36'),
(14, 20, 'register', 'New student registration: Jayanthan S', NULL, '2026-02-15 11:51:02'),
(15, 21, 'register', 'New student registration: subasree', NULL, '2026-02-15 11:57:47'),
(16, 21, 'login', 'student login: subasree', '::1', '2026-02-15 11:58:19'),
(17, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 12:11:05'),
(18, 10, 'login', 'student login: Jayanthan S', '::1', '2026-02-15 12:25:25'),
(19, 10, 'login', 'student login: Jayanthan S', '::1', '2026-02-15 13:06:14'),
(20, 1, 'login', 'admin login: Sowmiya', '::1', '2026-02-15 13:39:37');

-- --------------------------------------------------------

--
-- Table structure for table `aptitudeanswers`
--

CREATE TABLE `aptitudeanswers` (
  `id` int(11) NOT NULL,
  `attemptId` int(11) NOT NULL,
  `questionId` int(11) NOT NULL,
  `selectedOption` enum('A','B','C','D') DEFAULT NULL,
  `isCorrect` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `aptitudeanswers`
--

INSERT INTO `aptitudeanswers` (`id`, `attemptId`, `questionId`, `selectedOption`, `isCorrect`) VALUES
(1, 1, 1, 'A', 0),
(2, 1, 2, 'A', 0),
(3, 1, 3, 'A', 0);

-- --------------------------------------------------------

--
-- Table structure for table `aptitudequestions`
--

CREATE TABLE `aptitudequestions` (
  `id` int(11) NOT NULL,
  `testId` int(11) NOT NULL,
  `question` text NOT NULL,
  `optionA` varchar(500) NOT NULL,
  `optionB` varchar(500) NOT NULL,
  `optionC` varchar(500) NOT NULL,
  `optionD` varchar(500) NOT NULL,
  `correctOption` enum('A','B','C','D') NOT NULL,
  `marks` int(11) DEFAULT 1,
  `explanation` text DEFAULT NULL,
  `orderIndex` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `aptitudequestions`
--

INSERT INTO `aptitudequestions` (`id`, `testId`, `question`, `optionA`, `optionB`, `optionC`, `optionD`, `correctOption`, `marks`, `explanation`, `orderIndex`) VALUES
(1, 1, 'What comes next in the series: 2, 6, 12, 20, ?', '28', '30', '32', '36', 'B', 1, 'Differences: 4, 6, 8, 10. Next: 20+10=30', 1),
(2, 1, 'If A = 1, B = 2, ..., Z = 26, what is the sum of HELLO?', '50', '52', '48', '46', 'B', 1, 'H=8, E=5, L=12, L=12, O=15 => 52', 2),
(3, 1, 'Which number is odd one out: 2, 5, 11, 17, 23, 29, 30?', '5', '23', '30', '29', 'C', 1, '30 is not a prime number', 3),
(4, 1, 'What comes next in the series: 2, 6, 12, 20, ?', '28', '30', '32', '36', 'B', 1, 'Differences: 4, 6, 8, 10. Next: 20+10=30', 1),
(5, 1, 'If A = 1, B = 2, ..., Z = 26, what is the sum of HELLO?', '50', '52', '48', '46', 'B', 1, 'H=8, E=5, L=12, L=12, O=15 => 52', 2),
(6, 1, 'Which number is odd one out: 2, 5, 11, 17, 23, 29, 30?', '5', '23', '30', '29', 'C', 1, '30 is not a prime number', 3);

-- --------------------------------------------------------

--
-- Table structure for table `aptitudetestattempts`
--

CREATE TABLE `aptitudetestattempts` (
  `id` int(11) NOT NULL,
  `testId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `startedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `completedAt` datetime DEFAULT NULL,
  `score` int(11) DEFAULT 0,
  `totalMarks` int(11) DEFAULT 0,
  `status` enum('inProgress','completed','abandoned') DEFAULT 'inProgress'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `aptitudetestattempts`
--

INSERT INTO `aptitudetestattempts` (`id`, `testId`, `studentId`, `startedAt`, `completedAt`, `score`, `totalMarks`, `status`) VALUES
(1, 1, 5, '2026-02-15 08:11:31', '2026-02-15 13:41:38', 0, 10, 'completed'),
(2, 4, 10, '2026-02-15 12:32:28', NULL, 0, 15, 'inProgress'),
(3, 3, 10, '2026-02-15 12:32:36', NULL, 0, 10, 'inProgress'),
(4, 2, 10, '2026-02-15 12:32:40', '2026-02-15 18:02:43', 0, 15, 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `aptitudetests`
--

CREATE TABLE `aptitudetests` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `duration` int(11) DEFAULT 30 COMMENT 'in minutes',
  `totalQuestions` int(11) DEFAULT 0,
  `totalMarks` int(11) DEFAULT 0,
  `isPublished` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `aptitudetests`
--

INSERT INTO `aptitudetests` (`id`, `mentorId`, `title`, `description`, `duration`, `totalQuestions`, `totalMarks`, `isPublished`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Logical Reasoning Test', 'Test your logical thinking and reasoning abilities', 30, 10, 10, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(2, 2, 'Quantitative Aptitude', 'Numerical ability and mathematical reasoning', 45, 15, 15, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(3, 2, 'Logical Reasoning Test', 'Test your logical thinking and reasoning abilities', 30, 10, 10, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(4, 2, 'Quantitative Aptitude', 'Numerical ability and mathematical reasoning', 45, 15, 15, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `assignments`
--

CREATE TABLE `assignments` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `dueDate` datetime NOT NULL,
  `maxScore` int(11) DEFAULT 100,
  `isPublished` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `assignments`
--

INSERT INTO `assignments` (`id`, `courseId`, `mentorId`, `title`, `description`, `dueDate`, `maxScore`, `isPublished`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'Build a Landing Page', 'Create a responsive landing page using HTML and CSS', '2026-03-01 23:59:59', 100, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(2, 1, 2, 'JavaScript Todo App', 'Build an interactive todo application with vanilla JS', '2026-03-15 23:59:59', 100, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(3, 2, 2, 'Data Analysis Project', 'Analyze the provided dataset using Python pandas', '2026-03-10 23:59:59', 100, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(4, 7, 2, 'Build a Landing Page', 'Create a responsive landing page using HTML and CSS', '2026-03-01 23:59:59', 100, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(5, 7, 2, 'JavaScript Todo App', 'Build an interactive todo application with vanilla JS', '2026-03-15 23:59:59', 100, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(6, 1, 2, 'Data Analysis Project', 'Analyze the provided dataset using Python pandas', '2026-03-10 23:59:59', 100, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `assignmentsubmissions`
--

CREATE TABLE `assignmentsubmissions` (
  `id` int(11) NOT NULL,
  `assignmentId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `content` text DEFAULT NULL,
  `fileUrl` varchar(500) DEFAULT NULL,
  `submittedAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `score` int(11) DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `gradedAt` datetime DEFAULT NULL,
  `gradedBy` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `codingproblems`
--

CREATE TABLE `codingproblems` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty` enum('easy','medium','hard') DEFAULT 'easy',
  `category` varchar(100) DEFAULT NULL,
  `inputFormat` text DEFAULT NULL,
  `outputFormat` text DEFAULT NULL,
  `constraints` text DEFAULT NULL,
  `sampleInput` text DEFAULT NULL,
  `sampleOutput` text DEFAULT NULL,
  `testCases` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`testCases`)),
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `codingproblems`
--

INSERT INTO `codingproblems` (`id`, `mentorId`, `title`, `description`, `difficulty`, `category`, `inputFormat`, `outputFormat`, `constraints`, `sampleInput`, `sampleOutput`, `testCases`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', 'easy', 'Arrays', 'An array of integers and a target integer', 'Two indices', 'Array length 2 to 10^4', '[2,7,11,15]\n9', '[0,1]', '[{\"input\":\"[2,7,11,15]\\n9\",\"output\":\"[0,1]\"},{\"input\":\"[3,2,4]\\n6\",\"output\":\"[1,2]\"}]', '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(2, 2, 'Palindrome Check', 'Given a string, determine if it is a palindrome.', 'easy', 'Strings', 'A string', 'true or false', 'String length 1 to 10^5', 'racecar', 'true', '[{\"input\":\"racecar\",\"output\":\"true\"},{\"input\":\"hello\",\"output\":\"false\"}]', '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(3, 2, 'Two Sum', 'Given an array of integers nums and an integer target, return indices of the two numbers that add up to target.', 'easy', 'Arrays', 'An array of integers and a target integer', 'Two indices', 'Array length 2 to 10^4', '[2,7,11,15]\n9', '[0,1]', '[{\"input\":\"[2,7,11,15]\\n9\",\"output\":\"[0,1]\"},{\"input\":\"[3,2,4]\\n6\",\"output\":\"[1,2]\"}]', '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(4, 2, 'Palindrome Check', 'Given a string, determine if it is a palindrome.', 'easy', 'Strings', 'A string', 'true or false', 'String length 1 to 10^5', 'racecar', 'true', '[{\"input\":\"racecar\",\"output\":\"true\"},{\"input\":\"hello\",\"output\":\"false\"}]', '2026-02-15 10:31:21', '2026-02-15 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `codingsubmissions`
--

CREATE TABLE `codingsubmissions` (
  `id` int(11) NOT NULL,
  `problemId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `code` text NOT NULL,
  `language` varchar(50) DEFAULT 'javascript',
  `status` enum('pending','accepted','wrongAnswer','runtimeError','timeLimitExceeded') DEFAULT 'pending',
  `executionTime` int(11) DEFAULT NULL COMMENT 'in ms',
  `memory` int(11) DEFAULT NULL COMMENT 'in KB',
  `submittedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `codingsubmissions`
--

INSERT INTO `codingsubmissions` (`id`, `problemId`, `studentId`, `code`, `language`, `status`, `executionTime`, `memory`, `submittedAt`) VALUES
(1, 1, 5, 'def twoSum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i', 'python', 'pending', NULL, NULL, '2026-02-15 08:11:22'),
(2, 1, 5, 'def twoSum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in lookup:\n            return [lookup[complement], i]\n        lookup[num] = i', 'python', 'pending', NULL, NULL, '2026-02-15 08:11:24');

-- --------------------------------------------------------

--
-- Table structure for table `contactmessages`
--

CREATE TABLE `contactmessages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `coursecontent`
--

CREATE TABLE `coursecontent` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `subjectId` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `contentType` enum('video','pdf','text') DEFAULT 'text',
  `contentData` text DEFAULT NULL COMMENT 'URL for video, file path for PDF, text content for text',
  `sortOrder` int(11) DEFAULT 0,
  `status` enum('active','inactive') DEFAULT 'active',
  `uploadedBy` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coursecontent`
--

INSERT INTO `coursecontent` (`id`, `courseId`, `subjectId`, `title`, `description`, `contentType`, `contentData`, `sortOrder`, `status`, `uploadedBy`, `createdAt`, `updatedAt`) VALUES
(1, 7, 1, 'Introduction to HTML', 'Watch this introductory video about HTML basics', 'video', 'https://www.youtube.com/watch?v=qz0aGYrrlhU', 1, 'active', 2, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(2, 7, 1, 'HTML Elements Reference', 'Complete reference of all HTML5 elements and their attributes', 'text', 'HTML (HyperText Markup Language) is the standard markup language for creating web pages. Every HTML page has a structure that includes DOCTYPE, html, head, and body tags. Common elements include headings (h1-h6), paragraphs (p), links (a), images (img), and divs.', 2, 'active', 2, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(3, 7, 2, 'CSS Crash Course', 'Complete CSS tutorial from basics to advanced', 'video', 'https://www.youtube.com/watch?v=yfoY53QXEnI', 1, 'active', 2, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(4, 8, 4, 'JavaScript DOM Tutorial', 'Learn to manipulate HTML elements with JavaScript', 'video', 'https://www.youtube.com/watch?v=y17RuWkWdn8', 1, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(5, 8, 4, 'Async JavaScript Guide', 'Promises, async/await, and API calls', 'text', 'PROMISES\n========\nfetch(\"https://api.example.com/data\")\n  .then(res => res.json())\n  .then(data => console.log(data))\n  .catch(err => console.error(err));\n\nASYNC/AWAIT\n===========\nasync function getData() {\n  try {\n    const res = await fetch(url);\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error(err);\n  }\n}', 2, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(6, 8, 5, 'React Crash Course', 'Full React tutorial for beginners', 'video', 'https://www.youtube.com/watch?v=w7ejDZ8SWv8', 1, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(7, 14, 6, 'Getting Started with Python', 'Getting Started with Python', 'video', 'https://www.youtube.com/watch?v=kqtD5dpn9C8', 1, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(8, 14, 6, 'Python Variables & Types', 'Python Variables & Types', 'text', 'Python is dynamically typed. You dont need to declare variable types.\n\nCommon types:\n- int: 42\n- float: 3.14\n- str: \"hello\"\n- bool: True/False\n- list: [1,2,3]\n- dict: {\"key\": \"value\"}\n- tuple: (1,2,3)\n\nExample:\nname = \"Alice\"\nage = 25\npi = 3.14159\nis_student = True', 2, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(9, 14, 7, 'Control Flow in Python', 'Control Flow in Python', 'video', 'https://www.youtube.com/watch?v=Zp5MuPOtsSY', 1, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(10, 14, 7, 'Loop Examples', 'Loop Examples', 'text', '# For loop\nfor i in range(5):\n    print(i)  # 0, 1, 2, 3, 4\n\n# While loop\ncount = 0\nwhile count < 5:\n    print(count)\n    count += 1\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\n\n# Nested loop\nfor i in range(3):\n    for j in range(3):\n        print(f\"({i},{j})\", end=\" \")', 2, 'active', 2, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(11, 14, 8, 'Functions Tutorial', 'Functions Tutorial', 'video', 'https://www.youtube.com/watch?v=9Os0o3wzS_I', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(12, 14, 8, 'Function Reference', 'Function Reference', 'text', '# Basic function\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Default parameters\ndef power(base, exp=2):\n    return base ** exp\n\n# *args and **kwargs\ndef flexible(*args, **kwargs):\n    print(args)    # tuple\n    print(kwargs)  # dict\n\n# Lambda\nsquare = lambda x: x ** 2\n\n# Map & Filter\nnums = [1,2,3,4,5]\nevens = list(filter(lambda x: x%2==0, nums))\ndoubled = list(map(lambda x: x*2, nums))', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(13, 14, 9, 'OOP Concepts', 'OOP Concepts', 'video', 'https://www.youtube.com/watch?v=JeznW_7DlB0', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(14, 14, 9, 'OOP Code Examples', 'OOP Code Examples', 'text', 'class Animal:\n    def __init__(self, name, species):\n        self.name = name\n        self.species = species\n    \n    def speak(self):\n        return \"...\"\n\nclass Dog(Animal):\n    def __init__(self, name, breed):\n        super().__init__(name, \"Canine\")\n        self.breed = breed\n    \n    def speak(self):\n        return \"Woof!\"\n\n# Usage\ndog = Dog(\"Buddy\", \"Labrador\")\nprint(dog.speak())  # Woof!\nprint(dog.species)  # Canine', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(15, 14, 10, 'File Handling Guide', 'File Handling Guide', 'text', '# Reading a file\nwith open(\"data.txt\", \"r\") as f:\n    content = f.read()\n    # or line by line:\n    # for line in f:\n    #     print(line.strip())\n\n# Writing a file\nwith open(\"output.txt\", \"w\") as f:\n    f.write(\"Hello World\\n\")\n\n# Error handling\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f\"Error: {e}\")\nexcept Exception as e:\n    print(f\"Unexpected: {e}\")\nfinally:\n    print(\"Done\")', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(16, 15, 11, 'Arrays & Strings Overview', 'Arrays & Strings Overview', 'video', 'https://www.youtube.com/watch?v=HdFG8L1sajw', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(17, 15, 11, 'Key Patterns', 'Key Patterns', 'text', 'TWO POINTER TECHNIQUE\n======================\nUsed when array is sorted or when comparing elements.\n\nExample: Two Sum (sorted array)\ndef twoSum(arr, target):\n    left, right = 0, len(arr) - 1\n    while left < right:\n        s = arr[left] + arr[right]\n        if s == target: return [left, right]\n        elif s < target: left += 1\n        else: right -= 1\n\nSLIDING WINDOW\n==============\nUsed for subarray/substring problems.\n\nExample: Max sum subarray of size k\ndef maxSum(arr, k):\n    window = sum(arr[:k])\n    best = window\n    for i in range(k, len(arr)):\n        window += arr[i] - arr[i-k]\n        best = max(best, window)\n    return best', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(18, 15, 12, 'Linked Lists Explained', 'Linked Lists Explained', 'video', 'https://www.youtube.com/watch?v=njTh_OwMljA', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(19, 15, 12, 'Linked List Implementation', 'Linked List Implementation', 'text', 'class Node:\n    def __init__(self, data):\n        self.data = data\n        self.next = None\n\nclass LinkedList:\n    def __init__(self):\n        self.head = None\n    \n    def append(self, data):\n        new_node = Node(data)\n        if not self.head:\n            self.head = new_node\n            return\n        curr = self.head\n        while curr.next:\n            curr = curr.next\n        curr.next = new_node\n    \n    def reverse(self):\n        prev = None\n        curr = self.head\n        while curr:\n            next_temp = curr.next\n            curr.next = prev\n            prev = curr\n            curr = next_temp\n        self.head = prev', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(20, 15, 13, 'Stacks & Queues Tutorial', 'Stacks & Queues Tutorial', 'video', 'https://www.youtube.com/watch?v=wjI1WNcIntg', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(21, 15, 14, 'Trees & Graphs Visual Guide', 'Trees & Graphs Visual Guide', 'video', 'https://www.youtube.com/watch?v=oSWTXtMglKE', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(22, 15, 14, 'Tree & Graph Concepts', 'Tree & Graph Concepts', 'text', 'BINARY SEARCH TREE (BST)\n========================\nLeft child < Parent < Right child\n\nInsertion: O(log n) average\nSearch: O(log n) average\nDeletion: O(log n) average\n\nTraversals:\n- Inorder (L, Root, R): Sorted order\n- Preorder (Root, L, R): Copy tree\n- Postorder (L, R, Root): Delete tree\n- Level order: BFS with queue\n\nGRAPH REPRESENTATION\n====================\nAdjacency List: Space O(V+E)\n  graph = {0: [1,2], 1: [0,3], ...}\n\nAdjacency Matrix: Space O(V²)\n  matrix[i][j] = 1 if edge exists\n\nBFS: Queue-based, level by level\nDFS: Stack/recursion, depth first', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(23, 15, 15, 'Sorting Algorithms Comparison', 'Sorting Algorithms Comparison', 'video', 'https://www.youtube.com/watch?v=kPRA0W1kECg', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(24, 16, 16, 'React in 100 Seconds', 'React in 100 Seconds', 'video', 'https://www.youtube.com/watch?v=Tn6-PIqc4UM', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(25, 16, 16, 'React Basics', 'React Basics', 'text', 'REACT COMPONENT\n================\nfunction Greeting({ name }) {\n  return <h1>Hello, {name}!</h1>;\n}\n\nSTATE WITH HOOKS\n=================\nconst [count, setCount] = useState(0);\n\nreturn (\n  <div>\n    <p>Count: {count}</p>\n    <button onClick={() => setCount(count + 1)}>\n      Increment\n    </button>\n  </div>\n);', 2, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(26, 16, 17, 'React Hooks Explained', 'React Hooks Explained', 'video', 'https://www.youtube.com/watch?v=TNhaISOUy6Q', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(27, 16, 17, 'Hooks Cheat Sheet', 'Hooks Cheat Sheet', 'text', 'useState — State management\nconst [value, setValue] = useState(initial);\n\nuseEffect — Side effects\nuseEffect(() => {\n  // runs after render\n  return () => { /* cleanup */ };\n}, [dependencies]);\n\nuseRef — Mutable ref / DOM access\nconst ref = useRef(null);\n<input ref={ref} />\n\nuseMemo — Memoize expensive computation\nconst result = useMemo(() => expensiveFn(a, b), [a, b]);\n\nuseCallback — Memoize function reference\nconst handler = useCallback(() => { ... }, [deps]);', 2, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(28, 16, 18, 'React Router v6 Tutorial', 'React Router v6 Tutorial', 'video', 'https://www.youtube.com/watch?v=Ul3y1LXxzdU', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(29, 16, 19, 'API Calls in React', 'API Calls in React', 'text', 'FETCHING DATA\n==============\nconst [data, setData] = useState(null);\nconst [loading, setLoading] = useState(true);\n\nuseEffect(() => {\n  fetch(\"/api/items\")\n    .then(res => res.json())\n    .then(json => {\n      setData(json);\n      setLoading(false);\n    })\n    .catch(err => console.error(err));\n}, []);\n\nFORM HANDLING\n=============\nconst [form, setForm] = useState({ name: \"\", email: \"\" });\n\nconst handleChange = (e) => {\n  setForm({ ...form, [e.target.name]: e.target.value });\n};\n\nconst handleSubmit = async (e) => {\n  e.preventDefault();\n  await fetch(\"/api/submit\", {\n    method: \"POST\",\n    headers: { \"Content-Type\": \"application/json\" },\n    body: JSON.stringify(form)\n  });\n};', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(30, 17, 20, 'Database Design Tutorial', 'Database Design Tutorial', 'video', 'https://www.youtube.com/watch?v=ztHopE5Wnpc', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(31, 17, 20, 'Normalization Guide', 'Normalization Guide', 'text', 'DATABASE NORMALIZATION\n======================\n\n1NF: No repeating groups, atomic values\n  ✗ courses = \"Math, Science\"  \n  ✓ Separate rows for each course\n\n2NF: 1NF + No partial dependencies\n  Every non-key attribute depends on the WHOLE primary key\n\n3NF: 2NF + No transitive dependencies\n  Non-key attributes depend ONLY on the primary key\n\nBCNF: For every dependency X→Y, X is a superkey\n\nExample:\nStudents(id PK, name, email)\nCourses(id PK, title, dept)\nEnrollments(studentId FK, courseId FK, grade)', 2, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(32, 17, 21, 'SQL in 1 Hour', 'SQL in 1 Hour', 'video', 'https://www.youtube.com/watch?v=HXV3zeQKqGY', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(33, 17, 21, 'SQL Cheat Sheet', 'SQL Cheat Sheet', 'text', '-- SELECT\nSELECT name, email FROM users WHERE age > 18 ORDER BY name;\n\n-- JOIN\nSELECT u.name, c.title\nFROM users u\nJOIN enrollments e ON u.id = e.student_id\nJOIN courses c ON e.course_id = c.id;\n\n-- GROUP BY\nSELECT dept, COUNT(*) as total, AVG(salary) as avg_sal\nFROM employees\nGROUP BY dept\nHAVING COUNT(*) > 5;\n\n-- Subquery\nSELECT * FROM employees\nWHERE salary > (SELECT AVG(salary) FROM employees);', 2, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(34, 17, 22, 'Transactions & ACID', 'Transactions & ACID', 'text', 'ACID PROPERTIES\n================\nAtomicity: All or nothing\nConsistency: Valid state to valid state\nIsolation: Concurrent transactions don\'t interfere\nDurability: Committed data persists\n\nTRANSACTION CONTROL\n===================\nSTART TRANSACTION;\n  UPDATE accounts SET balance = balance - 100 WHERE id = 1;\n  UPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n-- or ROLLBACK; on error\n\nINDEXING\n========\nCREATE INDEX idx_email ON users(email);\n-- B-Tree index: O(log n) lookups\n-- Speeds up: WHERE, JOIN, ORDER BY\n-- Slows down: INSERT, UPDATE, DELETE', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(35, 18, 23, 'ML Crash Course', 'ML Crash Course', 'video', 'https://www.youtube.com/watch?v=ukzFI9rgwfU', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(36, 18, 23, 'ML Overview', 'ML Overview', 'text', 'TYPES OF MACHINE LEARNING\n=========================\n\n1. Supervised Learning\n   - Labeled data: input → output\n   - Classification: spam/not spam\n   - Regression: predict house price\n\n2. Unsupervised Learning\n   - Unlabeled data: find patterns\n   - Clustering: customer segments\n   - Dimensionality Reduction: PCA\n\n3. Reinforcement Learning\n   - Agent learns by reward/penalty\n   - Games, robotics, self-driving\n\nWORKFLOW\n========\n1. Collect Data\n2. Clean & Preprocess\n3. Feature Engineering\n4. Train Model\n5. Evaluate (accuracy, precision, recall)\n6. Tune Hyperparameters\n7. Deploy', 2, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(37, 18, 24, 'Linear Regression Explained', 'Linear Regression Explained', 'video', 'https://www.youtube.com/watch?v=nk2CQITm_eo', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(38, 18, 25, 'Clustering Algorithms', 'Clustering Algorithms', 'text', 'K-MEANS CLUSTERING\n==================\n1. Choose K centroids randomly\n2. Assign each point to nearest centroid\n3. Recalculate centroids as mean of cluster\n4. Repeat until convergence\n\nfrom sklearn.cluster import KMeans\n\nkmeans = KMeans(n_clusters=3)\nkmeans.fit(X)\nlabels = kmeans.predict(X)\ncenters = kmeans.cluster_centers_\n\nChoosing K: Elbow Method\n- Plot inertia (within-cluster sum of squares)\n- Look for \"elbow\" bend point', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(39, 18, 26, 'Neural Networks Intro', 'Neural Networks Intro', 'video', 'https://www.youtube.com/watch?v=aircAruvnKk', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(40, 19, 27, 'Node.js Tutorial', 'Node.js Tutorial', 'video', 'https://www.youtube.com/watch?v=TlB_eWDSMt4', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(41, 19, 28, 'Express REST API Guide', 'Express REST API Guide', 'text', 'import express from \"express\";\nconst app = express();\n\napp.use(express.json());\n\n// GET all items\napp.get(\"/api/items\", (req, res) => {\n  res.json({ items: [] });\n});\n\n// POST create item\napp.post(\"/api/items\", (req, res) => {\n  const { name, price } = req.body;\n  // validate, save to DB\n  res.status(201).json({ id: 1, name, price });\n});\n\n// Error middleware\napp.use((err, req, res, next) => {\n  console.error(err.stack);\n  res.status(500).json({ error: \"Server error\" });\n});\n\napp.listen(5000, () => console.log(\"Running on :5000\"));', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(42, 19, 29, 'JWT Authentication', 'JWT Authentication', 'text', 'JSON WEB TOKENS (JWT)\n=====================\n\nimport jwt from \"jsonwebtoken\";\nimport bcrypt from \"bcryptjs\";\n\n// Register\nconst hash = await bcrypt.hash(password, 10);\n// Save hash to DB\n\n// Login\nconst valid = await bcrypt.compare(password, hash);\nif (valid) {\n  const token = jwt.sign(\n    { userId: user.id, role: user.role },\n    process.env.JWT_SECRET,\n    { expiresIn: \"24h\" }\n  );\n  res.json({ token });\n}\n\n// Middleware\nfunction authenticate(req, res, next) {\n  const token = req.headers.authorization?.split(\" \")[1];\n  const decoded = jwt.verify(token, process.env.JWT_SECRET);\n  req.user = decoded;\n  next();\n}', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(43, 20, 30, 'Java Introduction', 'Java Introduction', 'video', 'https://www.youtube.com/watch?v=eIrMbAQSU34', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(44, 20, 30, 'Java Syntax Guide', 'Java Syntax Guide', 'text', 'public class Main {\n    public static void main(String[] args) {\n        // Variables\n        int age = 25;\n        String name = \"Alice\";\n        double gpa = 3.85;\n        boolean isActive = true;\n        \n        // Array\n        int[] numbers = {1, 2, 3, 4, 5};\n        \n        // For loop\n        for (int i = 0; i < numbers.length; i++) {\n            System.out.println(numbers[i]);\n        }\n        \n        // Enhanced for\n        for (int num : numbers) {\n            System.out.println(num);\n        }\n        \n        // Method call\n        int result = add(10, 20);\n    }\n    \n    static int add(int a, int b) {\n        return a + b;\n    }\n}', 2, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(45, 20, 31, 'Java OOP', 'Java OOP', 'text', '// Class definition\npublic class Animal {\n    protected String name;\n    \n    public Animal(String name) {\n        this.name = name;\n    }\n    \n    public void speak() {\n        System.out.println(\"...\");\n    }\n}\n\n// Inheritance\npublic class Dog extends Animal {\n    private String breed;\n    \n    public Dog(String name, String breed) {\n        super(name);\n        this.breed = breed;\n    }\n    \n    @Override\n    public void speak() {\n        System.out.println(\"Woof!\");\n    }\n}\n\n// Interface\npublic interface Drawable {\n    void draw();\n}\n\npublic class Circle implements Drawable {\n    public void draw() { ... }\n}', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(46, 20, 32, 'Java Collections', 'Java Collections', 'video', 'https://www.youtube.com/watch?v=viTainYq5B4', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(47, 21, 33, 'Agile & Scrum Overview', 'Agile & Scrum Overview', 'text', 'AGILE PRINCIPLES\n=================\n- Individuals and interactions over processes\n- Working software over documentation\n- Customer collaboration over contracts\n- Responding to change over following a plan\n\nSCRUM FRAMEWORK\n===============\nRoles: Product Owner, Scrum Master, Dev Team\nArtifacts: Product Backlog, Sprint Backlog, Increment\nCeremonies:\n  1. Sprint Planning (what to build)\n  2. Daily Standup (15 min sync)\n  3. Sprint Review (demo)\n  4. Sprint Retrospective (improve)\n\nSprint: 1-4 week iteration\nVelocity: Story points completed per sprint', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(48, 21, 34, 'Git & GitHub Guide', 'Git & GitHub Guide', 'text', 'GIT ESSENTIALS\n===============\ngit init              # Initialize repo\ngit add .             # Stage all files\ngit commit -m \"msg\"   # Commit\ngit branch feature    # Create branch\ngit checkout feature  # Switch branch\ngit merge feature     # Merge into current\ngit push origin main  # Push to remote\n\nBRANCHING STRATEGY\n==================\nmain ← develop ← feature/xxx\n              ← bugfix/xxx\n              ← hotfix/xxx\n\nCI/CD PIPELINE\n==============\n1. Developer pushes code\n2. CI server pulls & builds\n3. Run automated tests\n4. Static code analysis\n5. Deploy to staging\n6. Manual approval\n7. Deploy to production', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(49, 21, 35, 'Design Patterns Tutorial', 'Design Patterns Tutorial', 'video', 'https://www.youtube.com/watch?v=v9ejT8FO-7I', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(50, 22, 36, 'Networking Fundamentals', 'Networking Fundamentals', 'video', 'https://www.youtube.com/watch?v=3QhU9jd03a0', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(51, 22, 36, 'OSI Model Reference', 'OSI Model Reference', 'text', 'OSI 7 LAYERS\n=============\n7. Application  - HTTP, FTP, SMTP, DNS\n6. Presentation - SSL/TLS, encryption, compression\n5. Session      - Session management, authentication\n4. Transport    - TCP (reliable), UDP (fast)\n3. Network      - IP, routing, ICMP\n2. Data Link    - MAC, Ethernet, switches\n1. Physical     - Cables, signals, hubs\n\nTCP vs UDP\n==========\nTCP: Connection-oriented, reliable, ordered\n     Used for: HTTP, email, file transfer\n\nUDP: Connectionless, fast, no guarantee\n     Used for: streaming, gaming, DNS\n\nIP ADDRESSING (IPv4)\n====================\nFormat: 192.168.1.100\nClasses: A (1-126), B (128-191), C (192-223)\nSubnet: 255.255.255.0 = /24 = 254 hosts', 2, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(52, 22, 37, 'HTTP Protocol Explained', 'HTTP Protocol Explained', 'text', 'HTTP METHODS\n=============\nGET    - Retrieve resource\nPOST   - Create resource\nPUT    - Update resource (full)\nPATCH  - Update resource (partial)\nDELETE - Remove resource\n\nSTATUS CODES\n============\n200 OK\n201 Created\n301 Moved Permanently\n400 Bad Request\n401 Unauthorized\n403 Forbidden\n404 Not Found\n500 Internal Server Error\n\nHTTPS = HTTP + TLS\n- Encrypts data in transit\n- Certificate-based authentication\n- Prevents man-in-the-middle attacks', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(53, 23, 38, 'Processes & Threads', 'Processes & Threads', 'video', 'https://www.youtube.com/watch?v=exbKr6fnoUw', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(54, 23, 38, 'Process Management Notes', 'Process Management Notes', 'text', 'PROCESS STATES\n===============\nNew → Ready → Running → Waiting → Ready → Terminated\n\nPROCESS vs THREAD\n==================\nProcess: Independent, separate memory, heavy\nThread: Shares memory with parent, lightweight\n\nCONTEXT SWITCH\n===============\n- Save state of current process (PCB)\n- Load state of next process\n- Overhead: ~1-10 microseconds\n\nIPC (Inter-Process Communication)\n==================================\n1. Pipes (unidirectional)\n2. Message Queues\n3. Shared Memory\n4. Sockets\n5. Signals', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(55, 23, 39, 'CPU Scheduling Algorithms', 'CPU Scheduling Algorithms', 'text', 'SCHEDULING ALGORITHMS\n=====================\n\nFCFS (First Come First Serve)\n- Non-preemptive, simple\n- Convoy effect problem\n\nSJF (Shortest Job First)\n- Optimal average waiting time\n- Starvation possible\n\nRound Robin\n- Time quantum (e.g., 4ms)\n- Preemptive, fair\n- Higher context switch overhead\n\nPriority Scheduling\n- Each process has priority number\n- Can cause starvation\n- Solution: Aging\n\nMultilevel Queue\n- Separate queues for different types\n- System > Interactive > Batch', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(56, 23, 40, 'Virtual Memory & Paging', 'Virtual Memory & Paging', 'video', 'https://www.youtube.com/watch?v=sJCtpPQDJYw', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(57, 9, 41, 'Statistics for Data Science', 'Statistics for Data Science', 'video', 'https://www.youtube.com/watch?v=xxpc-HPKN28', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(58, 9, 41, 'Statistics Fundamentals', 'Statistics Fundamentals', 'text', 'DESCRIPTIVE STATISTICS\n======================\nMean: Average of all values\nMedian: Middle value when sorted\nMode: Most frequent value\nStd Dev: Spread of data around mean\n\nPROBABILITY\n===========\nP(A) = favorable outcomes / total outcomes\nP(A ∪ B) = P(A) + P(B) - P(A ∩ B)\nP(A|B) = P(A ∩ B) / P(B)  [Bayes theorem]\n\nDISTRIBUTIONS\n==============\nNormal: Bell curve, 68-95-99.7 rule\nBinomial: n trials, p probability\nPoisson: Events in fixed interval', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(59, 9, 42, 'Pandas Tutorial', 'Pandas Tutorial', 'video', 'https://www.youtube.com/watch?v=vmEHCJofslg', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(60, 9, 42, 'Pandas Cheat Sheet', 'Pandas Cheat Sheet', 'text', 'import pandas as pd\nimport numpy as np\n\n# Read data\ndf = pd.read_csv(\"data.csv\")\n\n# Explore\ndf.head()          # First 5 rows\ndf.info()          # Column types\ndf.describe()      # Statistics\ndf.shape           # (rows, cols)\n\n# Select\ndf[\"column\"]       # Single column\ndf[[\"col1\",\"col2\"]]# Multiple columns\ndf[df[\"age\"] > 25] # Filter rows\n\n# Clean\ndf.dropna()        # Remove NaN rows\ndf.fillna(0)       # Fill NaN with 0\ndf.duplicated()    # Find duplicates\n\n# Group\ndf.groupby(\"dept\")[\"salary\"].mean()\n\n# Plot\ndf[\"salary\"].hist()\ndf.plot(kind=\"scatter\", x=\"age\", y=\"salary\")', 2, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(61, 9, 43, 'Data Visualization Guide', 'Data Visualization Guide', 'text', 'CHART TYPES\n============\nBar Chart: Compare categories\nLine Chart: Trends over time\nScatter Plot: Relationships\nHistogram: Distribution\nBox Plot: Spread & outliers\nHeatmap: Correlation matrix\nPie Chart: Proportions (use sparingly)\n\nimport matplotlib.pyplot as plt\n\nfig, ax = plt.subplots(figsize=(10, 6))\nax.bar(categories, values, color=\"steelblue\")\nax.set_title(\"Sales by Category\")\nax.set_xlabel(\"Category\")\nax.set_ylabel(\"Sales ($)\")\nplt.tight_layout()\nplt.show()', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(62, 9, 44, 'ML with Scikit-learn', 'ML with Scikit-learn', 'video', 'https://www.youtube.com/watch?v=pqNCD_5r0IU', 1, 'active', 2, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(63, 10, 45, 'SEO Fundamentals', 'SEO Fundamentals', 'video', 'https://www.youtube.com/watch?v=DvwS7cV9GmQ', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(64, 10, 45, 'SEO Checklist', 'SEO Checklist', 'text', 'SEO CHECKLIST\n==============\n\nON-PAGE SEO\n- Title tag (50-60 chars, keyword first)\n- Meta description (150-160 chars)\n- H1, H2, H3 tags with keywords\n- Internal linking\n- Image alt tags\n- URL structure (/topic-keyword)\n- Mobile-friendly design\n- Page speed < 3 seconds\n\nCONTENT STRATEGY\n- Research keywords (Google Keyword Planner)\n- Create pillar content + clusters\n- E-A-T: Expertise, Authority, Trust\n- Update content regularly\n- 1500+ words for competitive topics\n\nTOOLS\n- Google Search Console\n- Google Analytics\n- Ahrefs / SEMrush\n- Yoast SEO (WordPress)', 2, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(65, 10, 46, 'Social Media Strategy', 'Social Media Strategy', 'text', 'PLATFORM OVERVIEW\n==================\nInstagram: Visual, 18-34 age, Reels perform well\nLinkedIn: B2B, professional content, articles\nTwitter/X: News, conversations, threads\nYouTube: Long-form video, tutorials, SEO\nTikTok: Short-form, Gen Z, trending audio\n\nCONTENT MIX\n============\n80% Value (educate, entertain, inspire)\n20% Promotional\n\nENGAGEMENT FORMULA\n===================\n1. Hook (first 3 seconds)\n2. Value (teach something)\n3. CTA (comment, share, follow)\n\nKEY METRICS\n===========\n- Reach & Impressions\n- Engagement Rate = (likes+comments+shares)/reach\n- Click-through Rate (CTR)\n- Conversion Rate\n- Follower Growth Rate', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(66, 10, 47, 'Email Marketing Guide', 'Email Marketing Guide', 'text', 'EMAIL MARKETING BEST PRACTICES\n================================\n\nSUBJECT LINES\n- Keep under 50 characters\n- Personalize with {first_name}\n- Create urgency or curiosity\n- A/B test different versions\n\nEMAIL STRUCTURE\n- Clear header with logo\n- Single CTA per email\n- Mobile-responsive design\n- Unsubscribe link (legally required)\n\nAUTOMATION SEQUENCES\n- Welcome series (3-5 emails)\n- Abandoned cart recovery\n- Re-engagement campaigns\n- Drip campaigns for nurturing\n\nKEY METRICS\n- Open Rate: 15-25% is good\n- Click Rate: 2-5% is good\n- Unsubscribe Rate: < 0.5%\n- Conversion Rate: Track per campaign', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(67, 11, 48, 'UI Design Fundamentals', 'UI Design Fundamentals', 'video', 'https://www.youtube.com/watch?v=_Hp_dI0DzY4', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(68, 11, 48, 'Design Principles Reference', 'Design Principles Reference', 'text', 'COLOR THEORY\n=============\nPrimary: Red, Blue, Yellow\nComplementary: Opposite on color wheel\nAnalogous: Adjacent on color wheel\n60-30-10 Rule: Primary-Secondary-Accent\n\nTYPOGRAPHY\n===========\n- Heading: Bold, larger, sans-serif\n- Body: Regular, 16px minimum, readable\n- Line height: 1.5-1.8x font size\n- Max 2-3 font families per project\n\nVISUAL HIERARCHY\n=================\n1. Size: Larger = more important\n2. Color: Bright/contrast = attention\n3. Position: Top-left first (F-pattern)\n4. Whitespace: Isolation = emphasis\n5. Alignment: Consistency = order\n\nGESTALT PRINCIPLES\n===================\n- Proximity: Close items = related\n- Similarity: Same style = grouped\n- Closure: Mind completes shapes\n- Continuity: Eye follows paths', 2, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(69, 11, 49, 'UX Research Methods', 'UX Research Methods', 'text', 'USER RESEARCH METHODS\n=====================\n\nQUANTITATIVE\n- Surveys (Google Forms, Typeform)\n- Analytics (heatmaps, click tracking)\n- A/B Testing\n\nQUALITATIVE\n- User Interviews (5-8 users)\n- Usability Testing (think-aloud protocol)\n- Card Sorting (information architecture)\n\nUSER PERSONA TEMPLATE\n=====================\nName: Sarah, 28, Marketing Manager\nGoals: Save time, automate reports\nFrustrations: Complex interfaces, slow loading\nTech: MacBook, iPhone, Chrome\nQuote: \"I need data at a glance\"\n\nWIREFRAMING TOOLS\n=================\n- Figma (free, collaborative)\n- Sketch (Mac only)\n- Adobe XD\n- Balsamiq (low-fidelity)', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(70, 11, 50, 'Figma Crash Course', 'Figma Crash Course', 'video', 'https://www.youtube.com/watch?v=FTFaQWZBqQ8', 1, 'active', 3, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(71, 12, 51, 'React Native Tutorial', 'React Native Tutorial', 'video', 'https://www.youtube.com/watch?v=0-S5a0eXPoc', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(72, 12, 51, 'React Native Basics', 'React Native Basics', 'text', 'CORE COMPONENTS\n=================\nimport { View, Text, Image, ScrollView, TextInput, TouchableOpacity } from \"react-native\";\n\nexport default function App() {\n  return (\n    <View style={styles.container}>\n      <Text style={styles.title}>Hello React Native!</Text>\n      <TouchableOpacity style={styles.button}>\n        <Text>Press Me</Text>\n      </TouchableOpacity>\n    </View>\n  );\n}\n\nconst styles = StyleSheet.create({\n  container: {\n    flex: 1,\n    justifyContent: \"center\",\n    alignItems: \"center\",\n    backgroundColor: \"#fff\",\n  },\n  title: {\n    fontSize: 24,\n    fontWeight: \"bold\",\n  },\n  button: {\n    backgroundColor: \"#007AFF\",\n    padding: 12,\n    borderRadius: 8,\n  },\n});', 2, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(73, 12, 52, 'React Native API & State', 'React Native API & State', 'text', 'FETCHING DATA\n==============\nconst [users, setUsers] = useState([]);\nconst [loading, setLoading] = useState(true);\n\nuseEffect(() => {\n  fetch(\"https://jsonplaceholder.typicode.com/users\")\n    .then(r => r.json())\n    .then(data => { setUsers(data); setLoading(false); });\n}, []);\n\nFLATLIST\n========\nimport { FlatList } from \"react-native\";\n\n<FlatList\n  data={users}\n  keyExtractor={item => item.id.toString()}\n  renderItem={({ item }) => (\n    <View><Text>{item.name}</Text></View>\n  )}\n/>\n\nASYNC STORAGE\n=============\nimport AsyncStorage from \"@react-native-async-storage/async-storage\";\nawait AsyncStorage.setItem(\"token\", \"abc123\");\nconst token = await AsyncStorage.getItem(\"token\");', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(74, 12, 53, 'Publishing Your App', 'Publishing Your App', 'video', 'https://www.youtube.com/watch?v=LE4Mgkrf7Sk', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(75, 13, 54, 'Cybersecurity Introduction', 'Cybersecurity Introduction', 'video', 'https://www.youtube.com/watch?v=inWWhr5tnEA', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(76, 13, 54, 'Security Concepts', 'Security Concepts', 'text', 'CIA TRIAD\n=========\nConfidentiality: Only authorized access\nIntegrity: Data is accurate and unmodified\nAvailability: Systems accessible when needed\n\nCOMMON THREATS\n==============\n- Malware (viruses, ransomware, trojans)\n- Phishing (fake emails/websites)\n- SQL Injection (malicious SQL input)\n- XSS (Cross-Site Scripting)\n- DDoS (Distributed Denial of Service)\n- Man-in-the-Middle (intercepting comms)\n- Social Engineering (human manipulation)\n\nSECURITY LAYERS\n===============\n1. Physical: Locks, cameras, badges\n2. Network: Firewalls, IDS/IPS, VPN\n3. Application: Input validation, auth\n4. Data: Encryption, backups\n5. User: Training, strong passwords, MFA', 2, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(77, 13, 55, 'Network Security Guide', 'Network Security Guide', 'text', 'FIREWALLS\n=========\n- Packet Filter: IP/port rules\n- Stateful: Tracks connections\n- Application Layer: Deep inspection\n- Next-Gen (NGFW): ML-based detection\n\nVPN (Virtual Private Network)\n==============================\n- Encrypts traffic between endpoints\n- Types: Site-to-Site, Remote Access\n- Protocols: OpenVPN, WireGuard, IPSec\n\nSSL/TLS HANDSHAKE\n==================\n1. Client Hello (supported ciphers)\n2. Server Hello (chosen cipher + cert)\n3. Key Exchange (asymmetric)\n4. Session Keys (symmetric)\n5. Encrypted communication begins\n\nIDS vs IPS\n==========\nIDS: Detects & alerts (passive)\nIPS: Detects & blocks (active)', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(78, 13, 56, 'OWASP Top 10 Explained', 'OWASP Top 10 Explained', 'video', 'https://www.youtube.com/watch?v=rWHniC8FOzc', 1, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40'),
(79, 13, 56, 'Web Security Practices', 'Web Security Practices', 'text', 'SQL INJECTION PREVENTION\n=========================\n// BAD - vulnerable\nquery = \"SELECT * FROM users WHERE id = \" + userId;\n\n// GOOD - parameterized\ndb.query(\"SELECT * FROM users WHERE id = ?\", [userId]);\n\nXSS PREVENTION\n===============\n1. Escape output: &lt; &gt; &amp;\n2. Use Content-Security-Policy header\n3. Set HttpOnly cookies\n4. Sanitize user input (DOMPurify)\n\nCSRF PROTECTION\n================\n1. CSRF tokens in forms\n2. SameSite cookie attribute\n3. Check Origin/Referer headers\n\nSECURITY HEADERS\n=================\nX-Content-Type-Options: nosniff\nX-Frame-Options: DENY\nStrict-Transport-Security: max-age=31536000\nContent-Security-Policy: default-src self', 2, 'active', 4, '2026-02-15 13:13:40', '2026-02-15 13:13:40');

-- --------------------------------------------------------

--
-- Table structure for table `courseenrollments`
--

CREATE TABLE `courseenrollments` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `enrolledAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `completionPercentage` decimal(5,2) DEFAULT 0.00,
  `status` enum('active','completed','dropped') DEFAULT 'active',
  `completedTopics` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`completedTopics`)),
  `completedAt` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courseenrollments`
--

INSERT INTO `courseenrollments` (`id`, `courseId`, `studentId`, `enrolledAt`, `completionPercentage`, `status`, `completedTopics`, `completedAt`) VALUES
(1, 1, 5, '2026-02-15 07:03:31', 31.00, 'active', '[]', NULL),
(2, 1, 6, '2026-02-15 07:03:31', 71.00, 'active', '[]', NULL),
(3, 2, 6, '2026-02-15 07:03:31', 67.00, 'active', '[]', NULL),
(4, 1, 7, '2026-02-15 07:03:31', 84.00, 'active', '[]', NULL),
(5, 2, 7, '2026-02-15 07:03:31', 71.00, 'active', '[]', NULL),
(6, 3, 7, '2026-02-15 07:03:31', 44.00, 'active', '[]', NULL),
(7, 1, 8, '2026-02-15 07:03:31', 16.00, 'active', '[]', NULL),
(8, 1, 9, '2026-02-15 07:03:31', 11.00, 'active', '[]', NULL),
(9, 2, 9, '2026-02-15 07:03:31', 42.00, 'active', '[]', NULL),
(10, 2, 5, '2026-02-15 08:09:58', 0.00, 'active', '[]', NULL),
(11, 7, 5, '2026-02-15 10:31:21', 87.00, 'active', '[]', NULL),
(12, 7, 6, '2026-02-15 10:31:21', 67.00, 'active', '[]', NULL),
(14, 7, 7, '2026-02-15 10:31:21', 72.00, 'active', '[]', NULL),
(17, 7, 8, '2026-02-15 10:31:21', 36.00, 'active', '[]', NULL),
(18, 7, 9, '2026-02-15 10:31:21', 12.00, 'active', '[]', NULL),
(20, 7, 10, '2026-02-15 10:31:21', 76.00, 'active', '[]', NULL),
(21, 1, 10, '2026-02-15 10:31:21', 49.00, 'active', '[]', NULL),
(22, 2, 10, '2026-02-15 10:31:21', 39.00, 'active', '[]', NULL),
(24, 14, 5, '2026-02-15 13:13:40', 13.00, 'active', '[]', NULL),
(25, 15, 5, '2026-02-15 13:13:40', 43.00, 'active', '[]', NULL),
(26, 16, 5, '2026-02-15 13:13:40', 52.00, 'active', '[]', NULL),
(27, 14, 6, '2026-02-15 13:13:40', 8.00, 'active', '[]', NULL),
(28, 16, 6, '2026-02-15 13:13:40', 52.00, 'active', '[]', NULL),
(29, 16, 7, '2026-02-15 13:13:40', 14.00, 'active', '[]', NULL),
(30, 15, 7, '2026-02-15 13:13:40', 43.00, 'active', '[]', NULL),
(31, 14, 8, '2026-02-15 13:13:40', 30.00, 'active', '[]', NULL),
(32, 15, 8, '2026-02-15 13:13:40', 11.00, 'active', '[]', NULL),
(33, 16, 8, '2026-02-15 13:13:40', 8.00, 'active', '[]', NULL),
(34, 16, 9, '2026-02-15 13:13:40', 56.00, 'active', '[]', NULL),
(35, 15, 9, '2026-02-15 13:13:40', 10.00, 'active', '[]', NULL),
(36, 17, 9, '2026-02-15 13:13:40', 12.00, 'active', '[]', NULL),
(37, 16, 10, '2026-02-15 13:13:40', 9.00, 'active', '[]', NULL),
(38, 15, 10, '2026-02-15 13:13:40', 19.00, 'active', '[]', NULL),
(39, 14, 10, '2026-02-15 13:13:40', 54.00, 'active', '[]', NULL),
(40, 18, 20, '2026-02-15 13:13:40', 2.00, 'active', '[]', NULL),
(41, 14, 20, '2026-02-15 13:13:40', 40.00, 'active', '[]', NULL),
(42, 15, 20, '2026-02-15 13:13:40', 25.00, 'active', '[]', NULL),
(43, 16, 21, '2026-02-15 13:13:40', 2.00, 'active', '[]', NULL),
(44, 17, 21, '2026-02-15 13:13:40', 48.00, 'active', '[]', NULL),
(45, 18, 21, '2026-02-15 13:13:40', 8.00, 'active', '[]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `coursematerials`
--

CREATE TABLE `coursematerials` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `fileUrl` varchar(500) DEFAULT NULL,
  `fileType` varchar(50) DEFAULT NULL,
  `orderIndex` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `courseCode` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image` varchar(500) DEFAULT NULL,
  `thumbnail` varchar(500) DEFAULT NULL,
  `syllabus` varchar(500) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `mentorId` int(11) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `courseType` enum('theory','practical','lab') DEFAULT 'theory',
  `difficulty` enum('beginner','intermediate','advanced') DEFAULT 'beginner',
  `semester` varchar(20) DEFAULT NULL,
  `regulation` varchar(50) DEFAULT NULL,
  `academicYear` varchar(20) DEFAULT NULL,
  `maxStudents` int(11) DEFAULT 100,
  `isPublished` tinyint(1) DEFAULT 0,
  `status` enum('draft','pending','active','rejected','inactive') DEFAULT 'draft',
  `approvedBy` int(11) DEFAULT NULL,
  `approvedAt` datetime DEFAULT NULL,
  `rejectionReason` text DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 0.0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `title`, `courseCode`, `description`, `image`, `thumbnail`, `syllabus`, `duration`, `mentorId`, `category`, `courseType`, `difficulty`, `semester`, `regulation`, `academicYear`, `maxStudents`, `isPublished`, `status`, `approvedBy`, `approvedAt`, `rejectionReason`, `rating`, `createdAt`, `updatedAt`) VALUES
(1, 'Web Development Bootcamp', NULL, 'Master HTML, CSS, JavaScript and modern frameworks to build responsive websites.', NULL, NULL, NULL, '8 weeks', 2, 'Web Development', 'theory', 'beginner', NULL, NULL, NULL, 100, 1, 'draft', NULL, NULL, NULL, 4.8, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(2, 'Data Science Fundamentals', NULL, 'Learn statistics, Python, data analysis, machine learning and visualization tools.', NULL, NULL, NULL, '12 weeks', 2, 'Data Science', 'theory', 'intermediate', NULL, NULL, NULL, 100, 1, 'draft', NULL, NULL, NULL, 4.0, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(3, 'Digital Marketing Masterclass', NULL, 'Comprehensive training in SEO, social media, email, content marketing and analytics.', NULL, NULL, NULL, '6 weeks', 3, 'Marketing', 'theory', 'beginner', NULL, NULL, NULL, 100, 1, 'draft', NULL, NULL, NULL, 4.9, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(4, 'UI/UX Design Essentials', NULL, 'Master user interface design principles and create stunning, user-friendly digital experiences.', NULL, NULL, NULL, '10 weeks', 3, 'Design', 'theory', 'intermediate', NULL, NULL, NULL, 100, 1, 'draft', NULL, NULL, NULL, 4.6, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(5, 'Mobile App Development', NULL, 'Build native iOS and Android applications using React Native and modern mobile frameworks.', NULL, NULL, NULL, '14 weeks', 4, 'Mobile Development', 'theory', 'advanced', NULL, NULL, NULL, 100, 1, 'draft', NULL, NULL, NULL, 4.3, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(6, 'Cybersecurity Fundamentals', NULL, 'Learn to identify vulnerabilities, implement security measures, and protect digital assets.', NULL, NULL, NULL, '12 weeks', 4, 'Cybersecurity', 'theory', 'intermediate', NULL, NULL, NULL, 100, 1, 'draft', NULL, NULL, NULL, 5.0, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(7, 'HTML', NULL, 'HTML Basics', NULL, NULL, NULL, '', 1, 'Read', 'theory', 'intermediate', NULL, NULL, NULL, 500, 0, 'draft', NULL, NULL, NULL, 0.0, '2026-02-15 10:06:48', '2026-02-15 10:06:48'),
(8, 'Web Development Bootcamp', 'CS101', 'Master HTML, CSS, JavaScript and modern frameworks to build responsive websites.', NULL, NULL, NULL, '8 weeks', 2, 'Web Development', 'theory', 'beginner', '1', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.8, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(9, 'Data Science Fundamentals', 'DS201', 'Learn statistics, Python, data analysis, machine learning and visualization tools.', NULL, NULL, NULL, '12 weeks', 2, 'Data Science', 'theory', 'intermediate', '3', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.0, '2026-02-15 10:31:21', '2026-02-15 10:53:34'),
(10, 'Digital Marketing Masterclass', 'MK101', 'Comprehensive training in SEO, social media, email, content marketing and analytics.', NULL, NULL, NULL, '6 weeks', 3, 'Marketing', 'theory', 'beginner', '1', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.9, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(11, 'UI/UX Design Essentials', 'DG301', 'Master user interface design principles and create stunning, user-friendly digital experiences.', NULL, NULL, NULL, '10 weeks', 3, 'Design', 'practical', 'intermediate', '4', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.6, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(12, 'Mobile App Development', 'CS401', 'Build native iOS and Android applications using React Native and modern mobile frameworks.', NULL, NULL, NULL, '14 weeks', 4, 'Mobile Development', 'lab', 'advanced', '6', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.3, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(13, 'Cybersecurity Fundamentals', 'CY201', 'Learn to identify vulnerabilities, implement security measures, and protect digital assets.', NULL, NULL, NULL, '12 weeks', 4, 'Cybersecurity', 'theory', 'intermediate', '3', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 5.0, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(14, 'Python Programming Mastery', 'PY101', 'Complete Python course from basics to advanced — variables, loops, OOP, file handling, modules, and real-world projects.', NULL, NULL, NULL, '10 weeks', 2, 'Programming', 'theory', 'beginner', '1', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.4, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(15, 'Data Structures & Algorithms', 'DSA301', 'Master arrays, linked lists, stacks, queues, trees, graphs, sorting, searching, and dynamic programming.', NULL, NULL, NULL, '14 weeks', 2, 'Data Structures', 'theory', 'intermediate', '3', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.0, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(16, 'React & Modern Frontend', 'FE201', 'Build modern web applications with React, hooks, state management, routing, and API integration.', NULL, NULL, NULL, '8 weeks', 3, 'Web Development', 'practical', 'intermediate', '4', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 3.8, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(17, 'Database Management Systems', 'DB201', 'Learn relational database design, SQL, normalization, transactions, indexing, and NoSQL basics.', NULL, NULL, NULL, '12 weeks', 3, 'Database', 'theory', 'intermediate', '3', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.1, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(18, 'Machine Learning Fundamentals', 'ML301', 'Supervised and unsupervised learning, regression, classification, clustering, neural networks, and model evaluation.', NULL, NULL, NULL, '16 weeks', 4, 'Machine Learning', 'theory', 'advanced', '5', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 3.9, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(19, 'Node.js & Express Backend', 'BE301', 'Build RESTful APIs with Node.js, Express, middleware, authentication, database integration, and deployment.', NULL, NULL, NULL, '10 weeks', 2, 'Web Development', 'lab', 'intermediate', '4', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.4, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(20, 'Java Object-Oriented Programming', 'JV201', 'Java fundamentals, OOP concepts — classes, inheritance, polymorphism, interfaces, generics, and collections.', NULL, NULL, NULL, '12 weeks', 4, 'Programming', 'theory', 'beginner', '2', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.9, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(21, 'Software Engineering Practices', 'SE401', 'SDLC, Agile, Git workflows, testing, CI/CD, code review, design patterns, and project management.', NULL, NULL, NULL, '10 weeks', 3, 'Software Engineering', 'theory', 'intermediate', '5', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 3.5, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(22, 'Computer Networks', 'CN301', 'OSI model, TCP/IP, routing, switching, DNS, HTTP, network security, and socket programming.', NULL, NULL, NULL, '12 weeks', 4, 'Networking', 'theory', 'intermediate', '4', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.0, '2026-02-15 13:13:39', '2026-02-15 13:13:39'),
(23, 'Operating Systems Concepts', 'OS301', 'Process management, scheduling, memory management, file systems, deadlocks, and virtual memory.', NULL, NULL, NULL, '12 weeks', 2, 'Systems', 'theory', 'intermediate', '4', NULL, NULL, 100, 1, 'active', NULL, NULL, NULL, 4.1, '2026-02-15 13:13:39', '2026-02-15 13:13:39');

-- --------------------------------------------------------

--
-- Table structure for table `coursesubjects`
--

CREATE TABLE `coursesubjects` (
  `id` int(11) NOT NULL,
  `courseId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `code` varchar(50) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `sortOrder` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coursesubjects`
--

INSERT INTO `coursesubjects` (`id`, `courseId`, `title`, `code`, `description`, `sortOrder`, `createdAt`) VALUES
(1, 7, 'HTML Fundamentals', 'U1', 'Learn the building blocks of web pages', 1, '2026-02-15 10:31:21'),
(2, 7, 'CSS Styling', 'U2', 'Master CSS for beautiful layouts and designs', 2, '2026-02-15 10:31:21'),
(3, 7, 'JavaScript Basics', 'U3', 'Introduction to programming with JavaScript', 3, '2026-02-15 10:31:21'),
(4, 8, 'JavaScript Essentials', 'U4', 'DOM manipulation, events, and async JS', 4, '2026-02-15 13:13:39'),
(5, 8, 'React Framework', 'U5', 'Building modern UIs with React', 5, '2026-02-15 13:13:39'),
(6, 14, 'Python Basics', 'U1', 'Unit 1: Python Basics', 1, '2026-02-15 13:13:39'),
(7, 14, 'Control Flow', 'U2', 'Unit 2: Control Flow', 2, '2026-02-15 13:13:39'),
(8, 14, 'Functions & Modules', 'U3', 'Unit 3: Functions & Modules', 3, '2026-02-15 13:13:40'),
(9, 14, 'OOP in Python', 'U4', 'Unit 4: OOP in Python', 4, '2026-02-15 13:13:40'),
(10, 14, 'File Handling & Error Handling', 'U5', 'Unit 5: File Handling & Error Handling', 5, '2026-02-15 13:13:40'),
(11, 15, 'Arrays & Strings', 'U1', 'Unit 1: Arrays & Strings', 1, '2026-02-15 13:13:40'),
(12, 15, 'Linked Lists', 'U2', 'Unit 2: Linked Lists', 2, '2026-02-15 13:13:40'),
(13, 15, 'Stacks & Queues', 'U3', 'Unit 3: Stacks & Queues', 3, '2026-02-15 13:13:40'),
(14, 15, 'Trees & Graphs', 'U4', 'Unit 4: Trees & Graphs', 4, '2026-02-15 13:13:40'),
(15, 15, 'Sorting & Searching', 'U5', 'Unit 5: Sorting & Searching', 5, '2026-02-15 13:13:40'),
(16, 16, 'React Fundamentals', 'U1', 'Unit 1: React Fundamentals', 1, '2026-02-15 13:13:40'),
(17, 16, 'React Hooks Deep Dive', 'U2', 'Unit 2: React Hooks Deep Dive', 2, '2026-02-15 13:13:40'),
(18, 16, 'Routing & State Management', 'U3', 'Unit 3: Routing & State Management', 3, '2026-02-15 13:13:40'),
(19, 16, 'API Integration & Forms', 'U4', 'Unit 4: API Integration & Forms', 4, '2026-02-15 13:13:40'),
(20, 17, 'Relational Database Design', 'U1', 'Unit 1: Relational Database Design', 1, '2026-02-15 13:13:40'),
(21, 17, 'SQL Fundamentals', 'U2', 'Unit 2: SQL Fundamentals', 2, '2026-02-15 13:13:40'),
(22, 17, 'Transactions & Indexing', 'U3', 'Unit 3: Transactions & Indexing', 3, '2026-02-15 13:13:40'),
(23, 18, 'Introduction to ML', 'U1', 'Unit 1: Introduction to ML', 1, '2026-02-15 13:13:40'),
(24, 18, 'Supervised Learning', 'U2', 'Unit 2: Supervised Learning', 2, '2026-02-15 13:13:40'),
(25, 18, 'Unsupervised Learning', 'U3', 'Unit 3: Unsupervised Learning', 3, '2026-02-15 13:13:40'),
(26, 18, 'Neural Networks', 'U4', 'Unit 4: Neural Networks', 4, '2026-02-15 13:13:40'),
(27, 19, 'Node.js Fundamentals', 'U1', 'Unit 1: Node.js Fundamentals', 1, '2026-02-15 13:13:40'),
(28, 19, 'Express.js & REST APIs', 'U2', 'Unit 2: Express.js & REST APIs', 2, '2026-02-15 13:13:40'),
(29, 19, 'Authentication & Security', 'U3', 'Unit 3: Authentication & Security', 3, '2026-02-15 13:13:40'),
(30, 20, 'Java Basics', 'U1', 'Unit 1: Java Basics', 1, '2026-02-15 13:13:40'),
(31, 20, 'OOP Concepts', 'U2', 'Unit 2: OOP Concepts', 2, '2026-02-15 13:13:40'),
(32, 20, 'Collections & Generics', 'U3', 'Unit 3: Collections & Generics', 3, '2026-02-15 13:13:40'),
(33, 21, 'SDLC & Agile', 'U1', 'Unit 1: SDLC & Agile', 1, '2026-02-15 13:13:40'),
(34, 21, 'Version Control & CI/CD', 'U2', 'Unit 2: Version Control & CI/CD', 2, '2026-02-15 13:13:40'),
(35, 21, 'Design Patterns', 'U3', 'Unit 3: Design Patterns', 3, '2026-02-15 13:13:40'),
(36, 22, 'Network Models', 'U1', 'Unit 1: Network Models', 1, '2026-02-15 13:13:40'),
(37, 22, 'Application Layer Protocols', 'U2', 'Unit 2: Application Layer Protocols', 2, '2026-02-15 13:13:40'),
(38, 23, 'Process Management', 'U1', 'Unit 1: Process Management', 1, '2026-02-15 13:13:40'),
(39, 23, 'CPU Scheduling', 'U2', 'Unit 2: CPU Scheduling', 2, '2026-02-15 13:13:40'),
(40, 23, 'Memory Management', 'U3', 'Unit 3: Memory Management', 3, '2026-02-15 13:13:40'),
(41, 9, 'Statistics & Probability', 'U1', 'Unit 1: Statistics & Probability', 1, '2026-02-15 13:13:40'),
(42, 9, 'Python for Data Science', 'U2', 'Unit 2: Python for Data Science', 2, '2026-02-15 13:13:40'),
(43, 9, 'Data Visualization', 'U3', 'Unit 3: Data Visualization', 3, '2026-02-15 13:13:40'),
(44, 9, 'Machine Learning Basics', 'U4', 'Unit 4: Machine Learning Basics', 4, '2026-02-15 13:13:40'),
(45, 10, 'SEO & Content Marketing', 'U1', 'Unit 1: SEO & Content Marketing', 1, '2026-02-15 13:13:40'),
(46, 10, 'Social Media Marketing', 'U2', 'Unit 2: Social Media Marketing', 2, '2026-02-15 13:13:40'),
(47, 10, 'Email Marketing & Analytics', 'U3', 'Unit 3: Email Marketing & Analytics', 3, '2026-02-15 13:13:40'),
(48, 11, 'Design Principles', 'U1', 'Unit 1: Design Principles', 1, '2026-02-15 13:13:40'),
(49, 11, 'UX Research & Wireframing', 'U2', 'Unit 2: UX Research & Wireframing', 2, '2026-02-15 13:13:40'),
(50, 11, 'UI Design Tools & Systems', 'U3', 'Unit 3: UI Design Tools & Systems', 3, '2026-02-15 13:13:40'),
(51, 12, 'React Native Fundamentals', 'U1', 'Unit 1: React Native Fundamentals', 1, '2026-02-15 13:13:40'),
(52, 12, 'State & API Integration', 'U2', 'Unit 2: State & API Integration', 2, '2026-02-15 13:13:40'),
(53, 12, 'Publishing & Deployment', 'U3', 'Unit 3: Publishing & Deployment', 3, '2026-02-15 13:13:40'),
(54, 13, 'Security Fundamentals', 'U1', 'Unit 1: Security Fundamentals', 1, '2026-02-15 13:13:40'),
(55, 13, 'Network Security', 'U2', 'Unit 2: Network Security', 2, '2026-02-15 13:13:40'),
(56, 13, 'Web Application Security', 'U3', 'Unit 3: Web Application Security', 3, '2026-02-15 13:13:40');

-- --------------------------------------------------------

--
-- Table structure for table `coursetopics`
--

CREATE TABLE `coursetopics` (
  `id` int(11) NOT NULL,
  `subjectId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `sortOrder` int(11) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coursetopics`
--

INSERT INTO `coursetopics` (`id`, `subjectId`, `title`, `description`, `sortOrder`, `createdAt`) VALUES
(1, 1, 'Introduction to HTML', 'What is HTML and how the web works', 1, '2026-02-15 10:31:21'),
(2, 1, 'HTML Tags & Elements', 'Common HTML tags and their usage', 2, '2026-02-15 10:31:21'),
(3, 1, 'Forms & Tables', 'Creating forms and tables in HTML', 3, '2026-02-15 10:31:21'),
(4, 2, 'CSS Selectors & Properties', 'How to target and style HTML elements', 1, '2026-02-15 10:31:21'),
(5, 2, 'Flexbox & Grid', 'Modern CSS layout techniques', 2, '2026-02-15 10:31:21'),
(6, 4, 'DOM Manipulation', NULL, 1, '2026-02-15 13:13:39'),
(7, 4, 'Event Listeners', NULL, 2, '2026-02-15 13:13:39'),
(8, 4, 'Fetch API & Promises', NULL, 3, '2026-02-15 13:13:39'),
(9, 4, 'Async/Await', NULL, 4, '2026-02-15 13:13:39'),
(10, 5, 'React Components', NULL, 1, '2026-02-15 13:13:39'),
(11, 5, 'State & Props', NULL, 2, '2026-02-15 13:13:39'),
(12, 5, 'useEffect Hook', NULL, 3, '2026-02-15 13:13:39'),
(13, 6, 'Introduction to Python', NULL, 1, '2026-02-15 13:13:39'),
(14, 6, 'Variables & Data Types', NULL, 2, '2026-02-15 13:13:39'),
(15, 6, 'Operators & Expressions', NULL, 3, '2026-02-15 13:13:39'),
(16, 6, 'Input & Output', NULL, 4, '2026-02-15 13:13:39'),
(17, 6, 'Type Casting', NULL, 5, '2026-02-15 13:13:39'),
(18, 7, 'If-Else Statements', NULL, 1, '2026-02-15 13:13:39'),
(19, 7, 'For Loops', NULL, 2, '2026-02-15 13:13:39'),
(20, 7, 'While Loops', NULL, 3, '2026-02-15 13:13:39'),
(21, 7, 'Break & Continue', NULL, 4, '2026-02-15 13:13:39'),
(22, 7, 'Nested Loops', NULL, 5, '2026-02-15 13:13:39'),
(23, 8, 'Defining Functions', NULL, 1, '2026-02-15 13:13:40'),
(24, 8, 'Parameters & Return', NULL, 2, '2026-02-15 13:13:40'),
(25, 8, 'Lambda Functions', NULL, 3, '2026-02-15 13:13:40'),
(26, 8, 'Built-in Functions', NULL, 4, '2026-02-15 13:13:40'),
(27, 8, 'Importing Modules', NULL, 5, '2026-02-15 13:13:40'),
(28, 9, 'Classes & Objects', NULL, 1, '2026-02-15 13:13:40'),
(29, 9, 'Constructors', NULL, 2, '2026-02-15 13:13:40'),
(30, 9, 'Inheritance', NULL, 3, '2026-02-15 13:13:40'),
(31, 9, 'Polymorphism', NULL, 4, '2026-02-15 13:13:40'),
(32, 9, 'Encapsulation', NULL, 5, '2026-02-15 13:13:40'),
(33, 10, 'Reading Files', NULL, 1, '2026-02-15 13:13:40'),
(34, 10, 'Writing Files', NULL, 2, '2026-02-15 13:13:40'),
(35, 10, 'Try-Except', NULL, 3, '2026-02-15 13:13:40'),
(36, 10, 'Custom Exceptions', NULL, 4, '2026-02-15 13:13:40'),
(37, 10, 'Context Managers', NULL, 5, '2026-02-15 13:13:40'),
(38, 11, 'Array Operations', NULL, 1, '2026-02-15 13:13:40'),
(39, 11, 'Two Pointer Technique', NULL, 2, '2026-02-15 13:13:40'),
(40, 11, 'Sliding Window', NULL, 3, '2026-02-15 13:13:40'),
(41, 11, 'String Manipulation', NULL, 4, '2026-02-15 13:13:40'),
(42, 11, 'Hashing', NULL, 5, '2026-02-15 13:13:40'),
(43, 12, 'Singly Linked List', NULL, 1, '2026-02-15 13:13:40'),
(44, 12, 'Doubly Linked List', NULL, 2, '2026-02-15 13:13:40'),
(45, 12, 'Circular Linked List', NULL, 3, '2026-02-15 13:13:40'),
(46, 12, 'Reversal', NULL, 4, '2026-02-15 13:13:40'),
(47, 12, 'Cycle Detection', NULL, 5, '2026-02-15 13:13:40'),
(48, 13, 'Stack Operations', NULL, 1, '2026-02-15 13:13:40'),
(49, 13, 'Queue Operations', NULL, 2, '2026-02-15 13:13:40'),
(50, 13, 'Expression Evaluation', NULL, 3, '2026-02-15 13:13:40'),
(51, 13, 'BFS using Queue', NULL, 4, '2026-02-15 13:13:40'),
(52, 13, 'Monotonic Stack', NULL, 5, '2026-02-15 13:13:40'),
(53, 14, 'Binary Trees', NULL, 1, '2026-02-15 13:13:40'),
(54, 14, 'BST Operations', NULL, 2, '2026-02-15 13:13:40'),
(55, 14, 'Tree Traversals', NULL, 3, '2026-02-15 13:13:40'),
(56, 14, 'Graph Representation', NULL, 4, '2026-02-15 13:13:40'),
(57, 14, 'BFS & DFS', NULL, 5, '2026-02-15 13:13:40'),
(58, 15, 'Bubble Sort', NULL, 1, '2026-02-15 13:13:40'),
(59, 15, 'Merge Sort', NULL, 2, '2026-02-15 13:13:40'),
(60, 15, 'Quick Sort', NULL, 3, '2026-02-15 13:13:40'),
(61, 15, 'Binary Search', NULL, 4, '2026-02-15 13:13:40'),
(62, 15, 'Counting Sort', NULL, 5, '2026-02-15 13:13:40'),
(63, 16, 'JSX & Components', NULL, 1, '2026-02-15 13:13:40'),
(64, 16, 'Props & State', NULL, 2, '2026-02-15 13:13:40'),
(65, 16, 'Event Handling', NULL, 3, '2026-02-15 13:13:40'),
(66, 16, 'Conditional Rendering', NULL, 4, '2026-02-15 13:13:40'),
(67, 16, 'Lists & Keys', NULL, 5, '2026-02-15 13:13:40'),
(68, 17, 'useState', NULL, 1, '2026-02-15 13:13:40'),
(69, 17, 'useEffect', NULL, 2, '2026-02-15 13:13:40'),
(70, 17, 'useRef', NULL, 3, '2026-02-15 13:13:40'),
(71, 17, 'useMemo & useCallback', NULL, 4, '2026-02-15 13:13:40'),
(72, 17, 'Custom Hooks', NULL, 5, '2026-02-15 13:13:40'),
(73, 18, 'React Router', NULL, 1, '2026-02-15 13:13:40'),
(74, 18, 'Context API', NULL, 2, '2026-02-15 13:13:40'),
(75, 18, 'useReducer', NULL, 3, '2026-02-15 13:13:40'),
(76, 18, 'Global State Patterns', NULL, 4, '2026-02-15 13:13:40'),
(77, 18, 'Route Guards', NULL, 5, '2026-02-15 13:13:40'),
(78, 19, 'Fetch & Axios', NULL, 1, '2026-02-15 13:13:40'),
(79, 19, 'Loading States', NULL, 2, '2026-02-15 13:13:40'),
(80, 19, 'Error Handling', NULL, 3, '2026-02-15 13:13:40'),
(81, 19, 'Form Validation', NULL, 4, '2026-02-15 13:13:40'),
(82, 19, 'File Uploads', NULL, 5, '2026-02-15 13:13:40'),
(83, 20, 'ER Diagrams', NULL, 1, '2026-02-15 13:13:40'),
(84, 20, 'Normalization (1NF-3NF)', NULL, 2, '2026-02-15 13:13:40'),
(85, 20, 'Primary & Foreign Keys', NULL, 3, '2026-02-15 13:13:40'),
(86, 20, 'Relationships', NULL, 4, '2026-02-15 13:13:40'),
(87, 20, 'Schema Design', NULL, 5, '2026-02-15 13:13:40'),
(88, 21, 'SELECT Queries', NULL, 1, '2026-02-15 13:13:40'),
(89, 21, 'JOIN Operations', NULL, 2, '2026-02-15 13:13:40'),
(90, 21, 'GROUP BY & HAVING', NULL, 3, '2026-02-15 13:13:40'),
(91, 21, 'Subqueries', NULL, 4, '2026-02-15 13:13:40'),
(92, 21, 'INSERT/UPDATE/DELETE', NULL, 5, '2026-02-15 13:13:40'),
(93, 22, 'ACID Properties', NULL, 1, '2026-02-15 13:13:40'),
(94, 22, 'Transaction Control', NULL, 2, '2026-02-15 13:13:40'),
(95, 22, 'Locking', NULL, 3, '2026-02-15 13:13:40'),
(96, 22, 'B-Tree Indexes', NULL, 4, '2026-02-15 13:13:40'),
(97, 22, 'Query Optimization', NULL, 5, '2026-02-15 13:13:40'),
(98, 23, 'What is Machine Learning?', NULL, 1, '2026-02-15 13:13:40'),
(99, 23, 'Types of ML', NULL, 2, '2026-02-15 13:13:40'),
(100, 23, 'Data Preprocessing', NULL, 3, '2026-02-15 13:13:40'),
(101, 23, 'Feature Engineering', NULL, 4, '2026-02-15 13:13:40'),
(102, 23, 'Train/Test Split', NULL, 5, '2026-02-15 13:13:40'),
(103, 24, 'Linear Regression', NULL, 1, '2026-02-15 13:13:40'),
(104, 24, 'Logistic Regression', NULL, 2, '2026-02-15 13:13:40'),
(105, 24, 'Decision Trees', NULL, 3, '2026-02-15 13:13:40'),
(106, 24, 'Random Forest', NULL, 4, '2026-02-15 13:13:40'),
(107, 24, 'SVM', NULL, 5, '2026-02-15 13:13:40'),
(108, 25, 'K-Means Clustering', NULL, 1, '2026-02-15 13:13:40'),
(109, 25, 'Hierarchical Clustering', NULL, 2, '2026-02-15 13:13:40'),
(110, 25, 'PCA', NULL, 3, '2026-02-15 13:13:40'),
(111, 25, 'DBSCAN', NULL, 4, '2026-02-15 13:13:40'),
(112, 25, 'Association Rules', NULL, 5, '2026-02-15 13:13:40'),
(113, 26, 'Perceptron', NULL, 1, '2026-02-15 13:13:40'),
(114, 26, 'Activation Functions', NULL, 2, '2026-02-15 13:13:40'),
(115, 26, 'Backpropagation', NULL, 3, '2026-02-15 13:13:40'),
(116, 26, 'CNN Basics', NULL, 4, '2026-02-15 13:13:40'),
(117, 26, 'Overfitting & Regularization', NULL, 5, '2026-02-15 13:13:40'),
(118, 27, 'Node.js Architecture', NULL, 1, '2026-02-15 13:13:40'),
(119, 27, 'Modules & NPM', NULL, 2, '2026-02-15 13:13:40'),
(120, 27, 'File System', NULL, 3, '2026-02-15 13:13:40'),
(121, 27, 'Event Loop', NULL, 4, '2026-02-15 13:13:40'),
(122, 27, 'Streams', NULL, 5, '2026-02-15 13:13:40'),
(123, 28, 'Express Setup', NULL, 1, '2026-02-15 13:13:40'),
(124, 28, 'Routes & Middleware', NULL, 2, '2026-02-15 13:13:40'),
(125, 28, 'Request/Response', NULL, 3, '2026-02-15 13:13:40'),
(126, 28, 'Error Handling', NULL, 4, '2026-02-15 13:13:40'),
(127, 28, 'CORS', NULL, 5, '2026-02-15 13:13:40'),
(128, 29, 'JWT Tokens', NULL, 1, '2026-02-15 13:13:40'),
(129, 29, 'Password Hashing', NULL, 2, '2026-02-15 13:13:40'),
(130, 29, 'Session Management', NULL, 3, '2026-02-15 13:13:40'),
(131, 29, 'Rate Limiting', NULL, 4, '2026-02-15 13:13:40'),
(132, 29, 'Input Validation', NULL, 5, '2026-02-15 13:13:40'),
(133, 30, 'JDK Setup', NULL, 1, '2026-02-15 13:13:40'),
(134, 30, 'Variables & Types', NULL, 2, '2026-02-15 13:13:40'),
(135, 30, 'Control Structures', NULL, 3, '2026-02-15 13:13:40'),
(136, 30, 'Arrays', NULL, 4, '2026-02-15 13:13:40'),
(137, 30, 'Methods', NULL, 5, '2026-02-15 13:13:40'),
(138, 31, 'Classes & Objects', NULL, 1, '2026-02-15 13:13:40'),
(139, 31, 'Constructors', NULL, 2, '2026-02-15 13:13:40'),
(140, 31, 'Inheritance', NULL, 3, '2026-02-15 13:13:40'),
(141, 31, 'Polymorphism', NULL, 4, '2026-02-15 13:13:40'),
(142, 31, 'Abstract Classes & Interfaces', NULL, 5, '2026-02-15 13:13:40'),
(143, 32, 'ArrayList', NULL, 1, '2026-02-15 13:13:40'),
(144, 32, 'HashMap', NULL, 2, '2026-02-15 13:13:40'),
(145, 32, 'LinkedList', NULL, 3, '2026-02-15 13:13:40'),
(146, 32, 'Generics', NULL, 4, '2026-02-15 13:13:40'),
(147, 32, 'Iterators', NULL, 5, '2026-02-15 13:13:40'),
(148, 33, 'Waterfall Model', NULL, 1, '2026-02-15 13:13:40'),
(149, 33, 'Agile Methodology', NULL, 2, '2026-02-15 13:13:40'),
(150, 33, 'Scrum Framework', NULL, 3, '2026-02-15 13:13:40'),
(151, 33, 'Sprint Planning', NULL, 4, '2026-02-15 13:13:40'),
(152, 33, 'User Stories', NULL, 5, '2026-02-15 13:13:40'),
(153, 34, 'Git Basics', NULL, 1, '2026-02-15 13:13:40'),
(154, 34, 'Branching Strategies', NULL, 2, '2026-02-15 13:13:40'),
(155, 34, 'Pull Requests', NULL, 3, '2026-02-15 13:13:40'),
(156, 34, 'CI/CD Pipelines', NULL, 4, '2026-02-15 13:13:40'),
(157, 34, 'Automated Testing', NULL, 5, '2026-02-15 13:13:40'),
(158, 35, 'Singleton', NULL, 1, '2026-02-15 13:13:40'),
(159, 35, 'Factory', NULL, 2, '2026-02-15 13:13:40'),
(160, 35, 'Observer', NULL, 3, '2026-02-15 13:13:40'),
(161, 35, 'Strategy', NULL, 4, '2026-02-15 13:13:40'),
(162, 35, 'MVC Pattern', NULL, 5, '2026-02-15 13:13:40'),
(163, 36, 'OSI 7 Layers', NULL, 1, '2026-02-15 13:13:40'),
(164, 36, 'TCP/IP Model', NULL, 2, '2026-02-15 13:13:40'),
(165, 36, 'Protocols Overview', NULL, 3, '2026-02-15 13:13:40'),
(166, 36, 'Network Devices', NULL, 4, '2026-02-15 13:13:40'),
(167, 36, 'IP Addressing', NULL, 5, '2026-02-15 13:13:40'),
(168, 37, 'HTTP/HTTPS', NULL, 1, '2026-02-15 13:13:40'),
(169, 37, 'DNS', NULL, 2, '2026-02-15 13:13:40'),
(170, 37, 'SMTP & POP3', NULL, 3, '2026-02-15 13:13:40'),
(171, 37, 'FTP', NULL, 4, '2026-02-15 13:13:40'),
(172, 37, 'WebSocket', NULL, 5, '2026-02-15 13:13:40'),
(173, 38, 'Process vs Thread', NULL, 1, '2026-02-15 13:13:40'),
(174, 38, 'Process States', NULL, 2, '2026-02-15 13:13:40'),
(175, 38, 'Context Switching', NULL, 3, '2026-02-15 13:13:40'),
(176, 38, 'IPC Mechanisms', NULL, 4, '2026-02-15 13:13:40'),
(177, 38, 'Multithreading', NULL, 5, '2026-02-15 13:13:40'),
(178, 39, 'FCFS', NULL, 1, '2026-02-15 13:13:40'),
(179, 39, 'SJF', NULL, 2, '2026-02-15 13:13:40'),
(180, 39, 'Round Robin', NULL, 3, '2026-02-15 13:13:40'),
(181, 39, 'Priority Scheduling', NULL, 4, '2026-02-15 13:13:40'),
(182, 39, 'Multilevel Queue', NULL, 5, '2026-02-15 13:13:40'),
(183, 40, 'Paging', NULL, 1, '2026-02-15 13:13:40'),
(184, 40, 'Segmentation', NULL, 2, '2026-02-15 13:13:40'),
(185, 40, 'Virtual Memory', NULL, 3, '2026-02-15 13:13:40'),
(186, 40, 'Page Replacement', NULL, 4, '2026-02-15 13:13:40'),
(187, 40, 'Thrashing', NULL, 5, '2026-02-15 13:13:40'),
(188, 41, 'Descriptive Statistics', NULL, 1, '2026-02-15 13:13:40'),
(189, 41, 'Probability Basics', NULL, 2, '2026-02-15 13:13:40'),
(190, 41, 'Distributions', NULL, 3, '2026-02-15 13:13:40'),
(191, 41, 'Hypothesis Testing', NULL, 4, '2026-02-15 13:13:40'),
(192, 41, 'Correlation', NULL, 5, '2026-02-15 13:13:40'),
(193, 42, 'NumPy Arrays', NULL, 1, '2026-02-15 13:13:40'),
(194, 42, 'Pandas DataFrames', NULL, 2, '2026-02-15 13:13:40'),
(195, 42, 'Data Cleaning', NULL, 3, '2026-02-15 13:13:40'),
(196, 42, 'Matplotlib', NULL, 4, '2026-02-15 13:13:40'),
(197, 42, 'Seaborn', NULL, 5, '2026-02-15 13:13:40'),
(198, 43, 'Chart Types', NULL, 1, '2026-02-15 13:13:40'),
(199, 43, 'Matplotlib Advanced', NULL, 2, '2026-02-15 13:13:40'),
(200, 43, 'Interactive Plots', NULL, 3, '2026-02-15 13:13:40'),
(201, 43, 'Dashboard Design', NULL, 4, '2026-02-15 13:13:40'),
(202, 43, 'Storytelling with Data', NULL, 5, '2026-02-15 13:13:40'),
(203, 44, 'Supervised Learning', NULL, 1, '2026-02-15 13:13:40'),
(204, 44, 'Linear Regression', NULL, 2, '2026-02-15 13:13:40'),
(205, 44, 'Classification', NULL, 3, '2026-02-15 13:13:40'),
(206, 44, 'Model Evaluation', NULL, 4, '2026-02-15 13:13:40'),
(207, 44, 'Scikit-learn', NULL, 5, '2026-02-15 13:13:40'),
(208, 45, 'Keyword Research', NULL, 1, '2026-02-15 13:13:40'),
(209, 45, 'On-Page SEO', NULL, 2, '2026-02-15 13:13:40'),
(210, 45, 'Content Strategy', NULL, 3, '2026-02-15 13:13:40'),
(211, 45, 'Blog Marketing', NULL, 4, '2026-02-15 13:13:40'),
(212, 45, 'SEO Tools', NULL, 5, '2026-02-15 13:13:40'),
(213, 46, 'Platform Strategy', NULL, 1, '2026-02-15 13:13:40'),
(214, 46, 'Content Calendar', NULL, 2, '2026-02-15 13:13:40'),
(215, 46, 'Engagement Tactics', NULL, 3, '2026-02-15 13:13:40'),
(216, 46, 'Influencer Marketing', NULL, 4, '2026-02-15 13:13:40'),
(217, 46, 'Analytics', NULL, 5, '2026-02-15 13:13:40'),
(218, 47, 'Email Campaigns', NULL, 1, '2026-02-15 13:13:40'),
(219, 47, 'Automation', NULL, 2, '2026-02-15 13:13:40'),
(220, 47, 'A/B Testing', NULL, 3, '2026-02-15 13:13:40'),
(221, 47, 'Google Analytics', NULL, 4, '2026-02-15 13:13:40'),
(222, 47, 'ROI Measurement', NULL, 5, '2026-02-15 13:13:40'),
(223, 48, 'Color Theory', NULL, 1, '2026-02-15 13:13:40'),
(224, 48, 'Typography', NULL, 2, '2026-02-15 13:13:40'),
(225, 48, 'Layout & Grid', NULL, 3, '2026-02-15 13:13:40'),
(226, 48, 'Visual Hierarchy', NULL, 4, '2026-02-15 13:13:40'),
(227, 48, 'Gestalt Principles', NULL, 5, '2026-02-15 13:13:40'),
(228, 49, 'User Personas', NULL, 1, '2026-02-15 13:13:40'),
(229, 49, 'User Journey Maps', NULL, 2, '2026-02-15 13:13:40'),
(230, 49, 'Wireframing', NULL, 3, '2026-02-15 13:13:40'),
(231, 49, 'Prototyping', NULL, 4, '2026-02-15 13:13:40'),
(232, 49, 'Usability Testing', NULL, 5, '2026-02-15 13:13:40'),
(233, 50, 'Figma Basics', NULL, 1, '2026-02-15 13:13:40'),
(234, 50, 'Components & Variants', NULL, 2, '2026-02-15 13:13:40'),
(235, 50, 'Design Systems', NULL, 3, '2026-02-15 13:13:40'),
(236, 50, 'Responsive Design', NULL, 4, '2026-02-15 13:13:40'),
(237, 50, 'Handoff to Developers', NULL, 5, '2026-02-15 13:13:40'),
(238, 51, 'Environment Setup', NULL, 1, '2026-02-15 13:13:40'),
(239, 51, 'Core Components', NULL, 2, '2026-02-15 13:13:40'),
(240, 51, 'Styling & Flexbox', NULL, 3, '2026-02-15 13:13:40'),
(241, 51, 'Navigation', NULL, 4, '2026-02-15 13:13:40'),
(242, 51, 'Platform-Specific Code', NULL, 5, '2026-02-15 13:13:40'),
(243, 52, 'useState & useEffect', NULL, 1, '2026-02-15 13:13:40'),
(244, 52, 'Fetching Data', NULL, 2, '2026-02-15 13:13:40'),
(245, 52, 'AsyncStorage', NULL, 3, '2026-02-15 13:13:40'),
(246, 52, 'Context API', NULL, 4, '2026-02-15 13:13:40'),
(247, 52, 'Redux Toolkit', NULL, 5, '2026-02-15 13:13:40'),
(248, 53, 'App Icons & Splash Screen', NULL, 1, '2026-02-15 13:13:40'),
(249, 53, 'Build for iOS', NULL, 2, '2026-02-15 13:13:40'),
(250, 53, 'Build for Android', NULL, 3, '2026-02-15 13:13:40'),
(251, 53, 'App Store Submission', NULL, 4, '2026-02-15 13:13:40'),
(252, 53, 'OTA Updates', NULL, 5, '2026-02-15 13:13:40'),
(253, 54, 'CIA Triad', NULL, 1, '2026-02-15 13:13:40'),
(254, 54, 'Types of Threats', NULL, 2, '2026-02-15 13:13:40'),
(255, 54, 'Attack Vectors', NULL, 3, '2026-02-15 13:13:40'),
(256, 54, 'Security Policies', NULL, 4, '2026-02-15 13:13:40'),
(257, 54, 'Risk Assessment', NULL, 5, '2026-02-15 13:13:40'),
(258, 55, 'Firewalls', NULL, 1, '2026-02-15 13:13:40'),
(259, 55, 'VPN', NULL, 2, '2026-02-15 13:13:40'),
(260, 55, 'IDS/IPS', NULL, 3, '2026-02-15 13:13:40'),
(261, 55, 'SSL/TLS', NULL, 4, '2026-02-15 13:13:40'),
(262, 55, 'Network Monitoring', NULL, 5, '2026-02-15 13:13:40'),
(263, 56, 'OWASP Top 10', NULL, 1, '2026-02-15 13:13:40'),
(264, 56, 'SQL Injection Prevention', NULL, 2, '2026-02-15 13:13:40'),
(265, 56, 'XSS Prevention', NULL, 3, '2026-02-15 13:13:40'),
(266, 56, 'CSRF Protection', NULL, 4, '2026-02-15 13:13:40'),
(267, 56, 'Security Headers', NULL, 5, '2026-02-15 13:13:40');

-- --------------------------------------------------------

--
-- Table structure for table `discussionreplies`
--

CREATE TABLE `discussionreplies` (
  `id` int(11) NOT NULL,
  `discussionId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `discussions`
--

CREATE TABLE `discussions` (
  `id` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `discussions`
--

INSERT INTO `discussions` (`id`, `courseId`, `userId`, `title`, `content`, `createdAt`, `updatedAt`) VALUES
(1, 1, 2, 'Welcome to Web Development!', 'Feel free to ask any questions about the course content here.', '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(2, 7, 2, 'Welcome to Web Development!', 'Feel free to ask any questions about the course content here.', '2026-02-15 10:31:21', '2026-02-15 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `doubtreplies`
--

CREATE TABLE `doubtreplies` (
  `id` int(11) NOT NULL,
  `doubtId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `content` text NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doubtreplies`
--

INSERT INTO `doubtreplies` (`id`, `doubtId`, `userId`, `content`, `createdAt`) VALUES
(1, 1, 1, 'Its a Scripting language', '2026-02-15 10:57:30');

-- --------------------------------------------------------

--
-- Table structure for table `doubts`
--

CREATE TABLE `doubts` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('open','in-progress','resolved','closed') DEFAULT 'open',
  `assignedMentorId` int(11) DEFAULT NULL,
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `doubts`
--

INSERT INTO `doubts` (`id`, `studentId`, `courseId`, `title`, `description`, `status`, `assignedMentorId`, `priority`, `createdAt`, `updatedAt`) VALUES
(1, 10, 7, 'What is HTML', NULL, 'in-progress', 1, 'high', '2026-02-15 10:56:23', '2026-02-15 10:57:30');

-- --------------------------------------------------------

--
-- Table structure for table `eventregistrations`
--

CREATE TABLE `eventregistrations` (
  `id` int(11) NOT NULL,
  `eventId` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `registeredAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('registered','attended','cancelled') DEFAULT 'registered'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `mentorId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `eventType` enum('webinar','workshop','liveSession','hackathon','other') DEFAULT 'liveSession',
  `startDate` datetime NOT NULL,
  `endDate` datetime NOT NULL,
  `location` varchar(500) DEFAULT NULL COMMENT 'URL or physical location',
  `maxParticipants` int(11) DEFAULT 100,
  `isPublished` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `mentorId`, `title`, `description`, `eventType`, `startDate`, `endDate`, `location`, `maxParticipants`, `isPublished`, `createdAt`, `updatedAt`) VALUES
(1, 2, 'React Masterclass', 'Deep dive into React hooks, context, and advanced patterns', 'webinar', '2026-03-01 10:00:00', '2026-03-01 12:00:00', 'https://meet.sowberry.com/react-masterclass', 200, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(2, 3, 'Design Thinking Workshop', 'Learn design thinking methodology for solving complex UX problems', 'workshop', '2026-03-05 14:00:00', '2026-03-05 17:00:00', 'https://meet.sowberry.com/design-workshop', 50, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(3, 2, 'React Masterclass', 'Deep dive into React hooks, context, and advanced patterns', 'webinar', '2026-03-01 10:00:00', '2026-03-01 12:00:00', 'https://meet.sowberry.com/react-masterclass', 200, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21'),
(4, 3, 'Design Thinking Workshop', 'Learn design thinking methodology for solving complex UX problems', 'workshop', '2026-03-05 14:00:00', '2026-03-05 17:00:00', 'https://meet.sowberry.com/design-workshop', 50, 1, '2026-02-15 10:31:21', '2026-02-15 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `id` int(11) NOT NULL,
  `studentId` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `assignmentId` int(11) DEFAULT NULL,
  `testId` int(11) DEFAULT NULL,
  `gradeType` enum('assignment','aptitude','course','overall') DEFAULT 'assignment',
  `score` decimal(8,2) DEFAULT 0.00,
  `maxScore` decimal(8,2) DEFAULT 100.00,
  `percentage` decimal(5,2) DEFAULT 0.00,
  `gradedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`id`, `studentId`, `courseId`, `assignmentId`, `testId`, `gradeType`, `score`, `maxScore`, `percentage`, `gradedAt`) VALUES
(1, 5, NULL, NULL, 1, 'aptitude', 0.00, 10.00, 0.00, '2026-02-15 08:11:38'),
(2, 10, NULL, NULL, 2, 'aptitude', 0.00, 15.00, 0.00, '2026-02-15 12:32:43');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `type` enum('info','success','warning','error') DEFAULT 'info',
  `isRead` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `otpcodes`
--

CREATE TABLE `otpcodes` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `code` varchar(10) NOT NULL,
  `expiresAt` datetime NOT NULL,
  `isUsed` tinyint(1) DEFAULT 0,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `otpcodes`
--

INSERT INTO `otpcodes` (`id`, `userId`, `email`, `code`, `expiresAt`, `isUsed`, `createdAt`) VALUES
(1, 10, 'itsmejayanthan@gmail.com', '161448', '2026-02-15 14:02:17', 0, '2026-02-15 08:22:17'),
(2, 20, 'jayanthan@gmail.com', '395460', '2026-02-15 17:31:02', 0, '2026-02-15 11:51:02'),
(3, 21, 'hha@gmial.com', '772351', '2026-02-15 17:37:47', 0, '2026-02-15 11:57:47');

-- --------------------------------------------------------

--
-- Table structure for table `studymaterials`
--

CREATE TABLE `studymaterials` (
  `id` int(11) NOT NULL,
  `courseId` int(11) DEFAULT NULL,
  `mentorId` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `fileUrl` varchar(500) DEFAULT NULL,
  `fileType` varchar(50) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `studymaterials`
--

INSERT INTO `studymaterials` (`id`, `courseId`, `mentorId`, `title`, `description`, `fileUrl`, `fileType`, `category`, `createdAt`) VALUES
(1, 1, 2, 'HTML & CSS Basics Guide', 'Comprehensive reference guide for HTML tags and CSS properties', NULL, 'pdf', 'Reference', '2026-02-15 07:03:31'),
(2, 7, 2, 'HTML & CSS Basics Guide', 'Comprehensive reference guide for HTML tags and CSS properties', NULL, 'pdf', 'Reference', '2026-02-15 10:31:21');

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

CREATE TABLE `systemsettings` (
  `id` int(11) NOT NULL,
  `settingKey` varchar(100) NOT NULL,
  `settingValue` text DEFAULT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `systemsettings`
--

INSERT INTO `systemsettings` (`id`, `settingKey`, `settingValue`, `updatedAt`) VALUES
(1, 'siteName', 'Sowberry Academy', '2026-02-15 07:03:31'),
(2, 'siteEmail', 'berries@sowberry.com', '2026-02-15 07:03:31'),
(3, 'sitePhone', '+91 8825756388', '2026-02-15 07:03:31'),
(4, 'maxFileUploadSize', '10', '2026-02-15 07:03:31'),
(5, 'maintenanceMode', 'false', '2026-02-15 07:03:31'),
(6, 'studentRegistration', 'true', '2026-02-15 07:03:31'),
(7, 'mentorRegistration', 'true', '2026-02-15 07:03:31');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) NOT NULL,
  `fullName` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `countryCode` varchar(10) DEFAULT '+91',
  `role` enum('admin','mentor','student') NOT NULL DEFAULT 'student',
  `profileImage` varchar(500) DEFAULT NULL,
  `college` varchar(255) DEFAULT NULL,
  `department` varchar(255) DEFAULT NULL,
  `year` varchar(20) DEFAULT NULL,
  `rollNumber` varchar(100) DEFAULT NULL,
  `gender` varchar(20) DEFAULT NULL,
  `dateOfBirth` date DEFAULT NULL,
  `address` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `github` varchar(500) DEFAULT NULL,
  `linkedin` varchar(500) DEFAULT NULL,
  `hackerrank` varchar(500) DEFAULT NULL,
  `leetcode` varchar(500) DEFAULT NULL,
  `isVerified` tinyint(1) DEFAULT 0,
  `isActive` tinyint(1) DEFAULT 1,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `fullName`, `password`, `phone`, `countryCode`, `role`, `profileImage`, `college`, `department`, `year`, `rollNumber`, `gender`, `dateOfBirth`, `address`, `bio`, `github`, `linkedin`, `hackerrank`, `leetcode`, `isVerified`, `isActive`, `createdAt`, `updatedAt`) VALUES
(1, 'admin@sowberry.com', 'sowadmin', 'Sowmiya', '$2a$10$4kVQUYhv.KkoYoPO5eH81O0cYHA6U.b5u9ede7z07H/dhoHO7h0JG', '', '+91', 'admin', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 08:07:50'),
(2, 'mentor1@sowberry.com', 'jayanthan_m', 'Jayanthan S', '$2a$10$9I1glhmgxbbdqYwnEfVQj.15hokfKE28lg75tzOUVQI2zUMOipTfm', '8825756381', '+91', 'mentor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(3, 'mentor2@sowberry.com', 'prithika_m', 'Prithika K', '$2a$10$9I1glhmgxbbdqYwnEfVQj.15hokfKE28lg75tzOUVQI2zUMOipTfm', '8825756382', '+91', 'mentor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(4, 'mentor3@sowberry.com', 'sreelekha_m', 'Sreelekha S', '$2a$10$9I1glhmgxbbdqYwnEfVQj.15hokfKE28lg75tzOUVQI2zUMOipTfm', '8825756383', '+91', 'mentor', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(5, 'student1@sowberry.com', 'aarav_s', 'Aarav Kumar', '$2a$10$8d6yTMJzx6zHUoLwE.u2MeZ0udREVtKhANOqK4L3hHZkDHwA2u1kq', '9442556781', '+91', 'student', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(6, 'student2@sowberry.com', 'diya_s', 'Diya Sharma', '$2a$10$8d6yTMJzx6zHUoLwE.u2MeZ0udREVtKhANOqK4L3hHZkDHwA2u1kq', '9442556782', '+91', 'student', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(7, 'student3@sowberry.com', 'arjun_s', 'Arjun Patel', '$2a$10$8d6yTMJzx6zHUoLwE.u2MeZ0udREVtKhANOqK4L3hHZkDHwA2u1kq', '9442556783', '+91', 'student', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(8, 'student4@sowberry.com', 'ananya_s', 'Ananya Roy', '$2a$10$8d6yTMJzx6zHUoLwE.u2MeZ0udREVtKhANOqK4L3hHZkDHwA2u1kq', '9442556784', '+91', 'student', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(9, 'student5@sowberry.com', 'rohan_s', 'Rohan Singh', '$2a$10$8d6yTMJzx6zHUoLwE.u2MeZ0udREVtKhANOqK4L3hHZkDHwA2u1kq', '9442556785', '+91', 'student', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-02-15 07:03:31', '2026-02-15 07:03:31'),
(10, 'itsmejayanthan@gmail.com', 'jayanthan', 'Jayanthan S', '$2a$10$c86hi1osMG2Fuq7KPP3eZOWx1adxqR0cw9NiS/hg1sfRmvgUgoydy', '+918825756388', '+91', 'student', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 0, 1, '2026-02-15 08:22:17', '2026-02-15 08:22:17'),
(20, 'jayanthan@gmail.com', 'jayanthan18', 'Jayanthan S', '$2a$10$a/ANSIFNEpMxtAGQCzFZDeqhBWIFbMGaIMmbKsgnEClouk./z0Zbu', '+918825756388', '+91', 'student', '/uploads/profiles/profile_1771156262106.jpg', 'IIT Madras', 'AIML', 'IV year', '927622BAL016', 'Male', '2004-11-18', 'Karur', 'Hello', NULL, NULL, NULL, NULL, 0, 1, '2026-02-15 11:51:02', '2026-02-15 11:51:02'),
(21, 'hha@gmial.com', 'aaaa', 'subasree', '$2a$10$AF/juEwfFokLXQVCXvGFFecLpxQdzf1Lp/jvpxEJmNPoGwEC3nF8G', '+9178962552320', '+91', 'student', '/uploads/profiles/profile_1771156667339.jpg', 'Anna University', 'AIDS', 'I year', '927625BAD014', 'Male', '2004-11-11', 'KArur', 'Jarur', NULL, NULL, NULL, NULL, 0, 1, '2026-02-15 11:57:47', '2026-02-15 11:57:47');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`userId`),
  ADD KEY `idx_created` (`createdAt`);

--
-- Indexes for table `aptitudeanswers`
--
ALTER TABLE `aptitudeanswers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `attemptId` (`attemptId`),
  ADD KEY `questionId` (`questionId`);

--
-- Indexes for table `aptitudequestions`
--
ALTER TABLE `aptitudequestions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_test` (`testId`);

--
-- Indexes for table `aptitudetestattempts`
--
ALTER TABLE `aptitudetestattempts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `testId` (`testId`),
  ADD KEY `idx_student` (`studentId`);

--
-- Indexes for table `aptitudetests`
--
ALTER TABLE `aptitudetests`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mentor` (`mentorId`);

--
-- Indexes for table `assignments`
--
ALTER TABLE `assignments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`courseId`),
  ADD KEY `idx_mentor` (`mentorId`);

--
-- Indexes for table `assignmentsubmissions`
--
ALTER TABLE `assignmentsubmissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_submission` (`assignmentId`,`studentId`),
  ADD KEY `gradedBy` (`gradedBy`),
  ADD KEY `idx_student` (`studentId`);

--
-- Indexes for table `codingproblems`
--
ALTER TABLE `codingproblems`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mentor` (`mentorId`),
  ADD KEY `idx_difficulty` (`difficulty`);

--
-- Indexes for table `codingsubmissions`
--
ALTER TABLE `codingsubmissions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student` (`studentId`),
  ADD KEY `idx_problem` (`problemId`);

--
-- Indexes for table `contactmessages`
--
ALTER TABLE `contactmessages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_unread` (`isRead`);

--
-- Indexes for table `coursecontent`
--
ALTER TABLE `coursecontent`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploadedBy` (`uploadedBy`),
  ADD KEY `idx_course` (`courseId`),
  ADD KEY `idx_subject` (`subjectId`);

--
-- Indexes for table `courseenrollments`
--
ALTER TABLE `courseenrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`courseId`,`studentId`),
  ADD KEY `idx_student` (`studentId`);

--
-- Indexes for table `coursematerials`
--
ALTER TABLE `coursematerials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`courseId`);

--
-- Indexes for table `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mentor` (`mentorId`),
  ADD KEY `idx_published` (`isPublished`);

--
-- Indexes for table `coursesubjects`
--
ALTER TABLE `coursesubjects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_course` (`courseId`);

--
-- Indexes for table `coursetopics`
--
ALTER TABLE `coursetopics`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_subject` (`subjectId`);

--
-- Indexes for table `discussionreplies`
--
ALTER TABLE `discussionreplies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `discussionId` (`discussionId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `discussions`
--
ALTER TABLE `discussions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `idx_course` (`courseId`);

--
-- Indexes for table `doubtreplies`
--
ALTER TABLE `doubtreplies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `doubtId` (`doubtId`),
  ADD KEY `userId` (`userId`);

--
-- Indexes for table `doubts`
--
ALTER TABLE `doubts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `idx_student` (`studentId`),
  ADD KEY `idx_mentor` (`assignedMentorId`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `eventregistrations`
--
ALTER TABLE `eventregistrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_registration` (`eventId`,`studentId`),
  ADD KEY `studentId` (`studentId`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_mentor` (`mentorId`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`id`),
  ADD KEY `courseId` (`courseId`),
  ADD KEY `assignmentId` (`assignmentId`),
  ADD KEY `testId` (`testId`),
  ADD KEY `idx_student` (`studentId`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`userId`),
  ADD KEY `idx_unread` (`userId`,`isRead`);

--
-- Indexes for table `otpcodes`
--
ALTER TABLE `otpcodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `userId` (`userId`),
  ADD KEY `idx_email_code` (`email`,`code`);

--
-- Indexes for table `studymaterials`
--
ALTER TABLE `studymaterials`
  ADD PRIMARY KEY (`id`),
  ADD KEY `mentorId` (`mentorId`),
  ADD KEY `idx_course` (`courseId`);

--
-- Indexes for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `settingKey` (`settingKey`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `idx_role` (`role`),
  ADD KEY `idx_email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activitylogs`
--
ALTER TABLE `activitylogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `aptitudeanswers`
--
ALTER TABLE `aptitudeanswers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `aptitudequestions`
--
ALTER TABLE `aptitudequestions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `aptitudetestattempts`
--
ALTER TABLE `aptitudetestattempts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `aptitudetests`
--
ALTER TABLE `aptitudetests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `assignments`
--
ALTER TABLE `assignments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `assignmentsubmissions`
--
ALTER TABLE `assignmentsubmissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `codingproblems`
--
ALTER TABLE `codingproblems`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `codingsubmissions`
--
ALTER TABLE `codingsubmissions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `contactmessages`
--
ALTER TABLE `contactmessages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `coursecontent`
--
ALTER TABLE `coursecontent`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `courseenrollments`
--
ALTER TABLE `courseenrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `coursematerials`
--
ALTER TABLE `coursematerials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `coursesubjects`
--
ALTER TABLE `coursesubjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `coursetopics`
--
ALTER TABLE `coursetopics`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

--
-- AUTO_INCREMENT for table `discussionreplies`
--
ALTER TABLE `discussionreplies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `discussions`
--
ALTER TABLE `discussions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `doubtreplies`
--
ALTER TABLE `doubtreplies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `doubts`
--
ALTER TABLE `doubts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `eventregistrations`
--
ALTER TABLE `eventregistrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `otpcodes`
--
ALTER TABLE `otpcodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `studymaterials`
--
ALTER TABLE `studymaterials`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `systemsettings`
--
ALTER TABLE `systemsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activitylogs`
--
ALTER TABLE `activitylogs`
  ADD CONSTRAINT `activitylogs_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `aptitudeanswers`
--
ALTER TABLE `aptitudeanswers`
  ADD CONSTRAINT `aptitudeanswers_ibfk_1` FOREIGN KEY (`attemptId`) REFERENCES `aptitudetestattempts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `aptitudeanswers_ibfk_2` FOREIGN KEY (`questionId`) REFERENCES `aptitudequestions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `aptitudequestions`
--
ALTER TABLE `aptitudequestions`
  ADD CONSTRAINT `aptitudequestions_ibfk_1` FOREIGN KEY (`testId`) REFERENCES `aptitudetests` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `aptitudetestattempts`
--
ALTER TABLE `aptitudetestattempts`
  ADD CONSTRAINT `aptitudetestattempts_ibfk_1` FOREIGN KEY (`testId`) REFERENCES `aptitudetests` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `aptitudetestattempts_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `aptitudetests`
--
ALTER TABLE `aptitudetests`
  ADD CONSTRAINT `aptitudetests_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignments`
--
ALTER TABLE `assignments`
  ADD CONSTRAINT `assignments_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignments_ibfk_2` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `assignmentsubmissions`
--
ALTER TABLE `assignmentsubmissions`
  ADD CONSTRAINT `assignmentsubmissions_ibfk_1` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignmentsubmissions_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `assignmentsubmissions_ibfk_3` FOREIGN KEY (`gradedBy`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `codingproblems`
--
ALTER TABLE `codingproblems`
  ADD CONSTRAINT `codingproblems_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `codingsubmissions`
--
ALTER TABLE `codingsubmissions`
  ADD CONSTRAINT `codingsubmissions_ibfk_1` FOREIGN KEY (`problemId`) REFERENCES `codingproblems` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `codingsubmissions_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coursecontent`
--
ALTER TABLE `coursecontent`
  ADD CONSTRAINT `coursecontent_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `coursecontent_ibfk_2` FOREIGN KEY (`subjectId`) REFERENCES `coursesubjects` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `coursecontent_ibfk_3` FOREIGN KEY (`uploadedBy`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courseenrollments`
--
ALTER TABLE `courseenrollments`
  ADD CONSTRAINT `courseenrollments_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `courseenrollments_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coursematerials`
--
ALTER TABLE `coursematerials`
  ADD CONSTRAINT `coursematerials_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `courses`
--
ALTER TABLE `courses`
  ADD CONSTRAINT `courses_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coursesubjects`
--
ALTER TABLE `coursesubjects`
  ADD CONSTRAINT `coursesubjects_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `coursetopics`
--
ALTER TABLE `coursetopics`
  ADD CONSTRAINT `coursetopics_ibfk_1` FOREIGN KEY (`subjectId`) REFERENCES `coursesubjects` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discussionreplies`
--
ALTER TABLE `discussionreplies`
  ADD CONSTRAINT `discussionreplies_ibfk_1` FOREIGN KEY (`discussionId`) REFERENCES `discussions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `discussionreplies_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `discussions`
--
ALTER TABLE `discussions`
  ADD CONSTRAINT `discussions_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `discussions_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doubtreplies`
--
ALTER TABLE `doubtreplies`
  ADD CONSTRAINT `doubtreplies_ibfk_1` FOREIGN KEY (`doubtId`) REFERENCES `doubts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doubtreplies_ibfk_2` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `doubts`
--
ALTER TABLE `doubts`
  ADD CONSTRAINT `doubts_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `doubts_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `doubts_ibfk_3` FOREIGN KEY (`assignedMentorId`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `eventregistrations`
--
ALTER TABLE `eventregistrations`
  ADD CONSTRAINT `eventregistrations_ibfk_1` FOREIGN KEY (`eventId`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `eventregistrations_ibfk_2` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grades_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `grades_ibfk_2` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `grades_ibfk_3` FOREIGN KEY (`assignmentId`) REFERENCES `assignments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `grades_ibfk_4` FOREIGN KEY (`testId`) REFERENCES `aptitudetests` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `otpcodes`
--
ALTER TABLE `otpcodes`
  ADD CONSTRAINT `otpcodes_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `studymaterials`
--
ALTER TABLE `studymaterials`
  ADD CONSTRAINT `studymaterials_ibfk_1` FOREIGN KEY (`courseId`) REFERENCES `courses` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `studymaterials_ibfk_2` FOREIGN KEY (`mentorId`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
