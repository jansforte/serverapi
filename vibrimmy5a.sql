-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-09-2023 a las 03:08:02
-- Versión del servidor: 10.4.25-MariaDB
-- Versión de PHP: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `vibrimmy5a`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rcurso`
--

CREATE TABLE `rcurso` (
  `id_rcurso` int(11) NOT NULL,
  `fCurso` date NOT NULL,
  `codigoCursoxxx` int(11) NOT NULL,
  `codigoEstudnte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_adminxxx`
--

CREATE TABLE `tbl_adminxxx` (
  `codigoAdminxxx` int(11) NOT NULL,
  `nombreAdminxxx` varchar(50) NOT NULL,
  `emailxUsuariox` varchar(120) NOT NULL,
  `fechaxRegistro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_adminxxx`
--

INSERT INTO `tbl_adminxxx` (`codigoAdminxxx`, `nombreAdminxxx`, `emailxUsuariox`, `fechaxRegistro`) VALUES
(1, 'admin', 'jansforte@gmail.com', '2022-08-01 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_asesoria`
--

CREATE TABLE `tbl_asesoria` (
  `codigoAsesoria` int(11) NOT NULL,
  `codigoDocentex` varchar(30) NOT NULL,
  `codigoEstudnte` varchar(30) NOT NULL,
  `descriAsesoria` text NOT NULL,
  `fechaxAsesoria` date DEFAULT NULL,
  `horaxxInicioxx` time DEFAULT NULL,
  `horaxxFinalxxx` time DEFAULT NULL,
  `codigoGoogleID` varchar(50) DEFAULT NULL,
  `numeroEstadoxx` tinyint(1) NOT NULL DEFAULT 1,
  `estadoNotifica` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_asesoria`
--

INSERT INTO `tbl_asesoria` (`codigoAsesoria`, `codigoDocentex`, `codigoEstudnte`, `descriAsesoria`, `fechaxAsesoria`, `horaxxInicioxx`, `horaxxFinalxxx`, `codigoGoogleID`, `numeroEstadoxx`, `estadoNotifica`) VALUES
(1, '1077875338', '1152461197', 'prueba', '2022-10-25', '23:01:00', '23:22:00', '9l32o2825g8eidkcb09lej0ir0', 1, 2),
(2, '1077875338', '1152461197', 'Solicito Asesoría sobre el apartado del proyecto donde blablabla', '2022-10-06', '16:40:00', '17:40:00', 'lmjtuco2pqrsm4g84fu66mfh74', 2, 2),
(3, '11121131', '1077875338', 'Solicito una reunión para etapas de emprendimiento', '2023-02-26', '21:00:00', '23:59:00', 'jearkj302do1j849gne4svjjk0', 2, 2),
(4, '11121131', '1077875338', 'Solicito una reunión para tener avances', '2023-02-28', '11:00:00', '12:00:00', 'anve08qca3i1mtb9pkkd6qkemk', 2, 2),
(5, '11121131', '1077875338', 'Solicito una reunión para una asesoria respecto a gestion empresarial', '2023-03-07', '10:30:00', '10:45:00', 'h16u4rfk577fbuolal2ete2qmc', 2, 2),
(6, '11121131', '1077875338', 'ok', NULL, NULL, NULL, NULL, 1, 1),
(7, '1077875338', '1077875338', 'Solicita asesirua', NULL, NULL, NULL, NULL, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_asistenx`
--

CREATE TABLE `tbl_asistenx` (
  `codigoAsistenx` int(11) NOT NULL,
  `codigoEstudnte` int(11) NOT NULL,
  `codigoEventoxx` int(11) NOT NULL,
  `indicaAsistenc` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_casoexit`
--

CREATE TABLE `tbl_casoexit` (
  `codigoCasoexit` int(11) NOT NULL,
  `codigoAdminxxx` int(11) NOT NULL,
  `nombreCasoexit` varchar(100) NOT NULL,
  `fechaxCasoexit` date NOT NULL,
  `imagenCasoexit` blob NOT NULL,
  `descriCasoexit` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_curshora`
--

CREATE TABLE `tbl_curshora` (
  `codigoCurshora` int(11) NOT NULL,
  `codigoCursoxxx` int(11) NOT NULL,
  `diaxxxCurshora` varchar(12) NOT NULL,
  `horainHorariox` time NOT NULL,
  `horafnHorariox` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_curshora`
--

INSERT INTO `tbl_curshora` (`codigoCurshora`, `codigoCursoxxx`, `diaxxxCurshora`, `horainHorariox`, `horafnHorariox`) VALUES
(45, 2, 'Lunes', '01:00:00', '12:00:00'),
(46, 2, 'Martes', '13:00:00', '16:00:00'),
(86, 3, 'Lunes', '01:00:00', '12:00:00'),
(87, 3, 'Viernes', '13:00:00', '16:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_cursoxxx`
--

CREATE TABLE `tbl_cursoxxx` (
  `codigoCursoxxx` int(11) NOT NULL,
  `codigoAdminxxx` int(11) NOT NULL,
  `nombreCursoxxx` varchar(50) NOT NULL,
  `mFormaCursoxxx` varchar(25) NOT NULL,
  `fIInscCursoxxx` date NOT NULL,
  `fFInscCursoxxx` date NOT NULL,
  `fIAcadCursoxxx` date NOT NULL,
  `fFAcadCursoxxx` date NOT NULL,
  `descriCursoxxx` text NOT NULL,
  `usuariCreacion` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_cursoxxx`
--

INSERT INTO `tbl_cursoxxx` (`codigoCursoxxx`, `codigoAdminxxx`, `nombreCursoxxx`, `mFormaCursoxxx`, `fIInscCursoxxx`, `fFInscCursoxxx`, `fIAcadCursoxxx`, `fFAcadCursoxxx`, `descriCursoxxx`, `usuariCreacion`) VALUES
(2, 1, 'Matematicas I', 'virtual', '2023-01-02', '2023-01-30', '2023-01-23', '2023-02-06', 'Nuevos valores ok', 'jansforte@gmail.com'),
(3, 1, 'Analisis', 'virtual', '2023-03-05', '2023-03-12', '2023-03-12', '2023-03-19', 'Analisis de prueba', 'jansforte@gmail.com');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_docentex`
--

CREATE TABLE `tbl_docentex` (
  `codigoDocentex` int(11) NOT NULL,
  `codigoAdminxxx` int(11) NOT NULL,
  `codigoEtapaxxx` int(11) NOT NULL,
  `nombreDocentex` varchar(50) NOT NULL,
  `apelliDocentex` varchar(100) NOT NULL,
  `generoDocentex` varchar(15) NOT NULL,
  `fechaxNacimien` date NOT NULL,
  `profesDocentex` varchar(120) NOT NULL,
  `numeroCelularx` varchar(10) NOT NULL,
  `direccDocentex` varchar(50) NOT NULL,
  `emailxUsuariox` varchar(120) NOT NULL,
  `fechaxRegistro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_docentex`
--

INSERT INTO `tbl_docentex` (`codigoDocentex`, `codigoAdminxxx`, `codigoEtapaxxx`, `nombreDocentex`, `apelliDocentex`, `generoDocentex`, `fechaxNacimien`, `profesDocentex`, `numeroCelularx`, `direccDocentex`, `emailxUsuariox`, `fechaxRegistro`) VALUES
(11121131, 1, 2, 'Profesor', 'Rogelio', 'M', '2022-10-08', 'Docente', '3211112233', 'calle 5A23A36', 'jorgemai@uceva.edu.co', '2022-10-09 03:36:47'),
(62147528, 1, 2, 'Edwin', 'Cardona', 'M', '1998-01-12', 'Ingeniero', '3217749146', 'calle 5A #23A-36', 'johan.fuentes@tendencyapps.com', '2023-09-14 00:16:16'),
(1077875338, 1, 1, 'El Pelos', 'Raspado', 'masculino', '2022-08-01', '', '1111111111', 'calle 4 A #2307', 'elpelosraspado@uceva.edu.co', '2022-08-31 00:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_docnetap`
--

CREATE TABLE `tbl_docnetap` (
  `codigoDocnetap` int(11) NOT NULL,
  `codigoEtapaxxx` char(2) NOT NULL,
  `codigoDocentex` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_docnetap`
--

INSERT INTO `tbl_docnetap` (`codigoDocnetap`, `codigoEtapaxxx`, `codigoDocentex`) VALUES
(1, '2', '62147528'),
(2, '4', '62147528');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estatare`
--

CREATE TABLE `tbl_estatare` (
  `codigoEstatare` int(11) NOT NULL,
  `nombreEstatare` varchar(26) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_estatare`
--

INSERT INTO `tbl_estatare` (`codigoEstatare`, `nombreEstatare`) VALUES
(1, 'En proceso'),
(2, 'Ejecutada'),
(3, 'Aprobada'),
(4, 'Devolver al estudiante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estudisp`
--

CREATE TABLE `tbl_estudisp` (
  `codigoEstudisp` int(11) NOT NULL,
  `codigoEstudnte` varchar(30) NOT NULL,
  `lunesxHorainic` time DEFAULT NULL,
  `lunesxHorafinx` time DEFAULT NULL,
  `martesHorainic` time DEFAULT NULL,
  `martesHorafinx` time DEFAULT NULL,
  `miercoHorainic` time DEFAULT NULL,
  `miercoHorafinx` time DEFAULT NULL,
  `juevesHorainic` time DEFAULT NULL,
  `juevesHorafinx` time DEFAULT NULL,
  `vierneHorainic` time DEFAULT NULL,
  `vierneHorafinx` time DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_estudisp`
--

INSERT INTO `tbl_estudisp` (`codigoEstudisp`, `codigoEstudnte`, `lunesxHorainic`, `lunesxHorafinx`, `martesHorainic`, `martesHorafinx`, `miercoHorainic`, `miercoHorafinx`, `juevesHorainic`, `juevesHorafinx`, `vierneHorainic`, `vierneHorafinx`) VALUES
(9, '1152461197', '00:00:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, '1077875338', '15:09:00', '15:09:00', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_estudnte`
--

CREATE TABLE `tbl_estudnte` (
  `codigoEstudnte` int(11) NOT NULL,
  `nombreEstudnte` varchar(50) NOT NULL,
  `apelliEstudnte` varchar(90) NOT NULL,
  `generoEstudnte` varchar(15) NOT NULL,
  `fechaxNacimien` date NOT NULL,
  `numeroCelularx` varchar(10) NOT NULL,
  `direccEstudnte` varchar(50) NOT NULL,
  `profesEstudnte` varchar(150) DEFAULT NULL,
  `emailxUsuariox` varchar(120) NOT NULL,
  `fechaxRegistro` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_estudnte`
--

INSERT INTO `tbl_estudnte` (`codigoEstudnte`, `nombreEstudnte`, `apelliEstudnte`, `generoEstudnte`, `fechaxNacimien`, `numeroCelularx`, `direccEstudnte`, `profesEstudnte`, `emailxUsuariox`, `fechaxRegistro`) VALUES
(16253337, 'rodrigo', 'herrera', 'M', '1957-04-30', '3217741111', 'calle 5A', NULL, 'rherrera@uceva.edu.co', '2023-05-08 14:49:03'),
(1077875338, 'Jans', 'Forte', 'M', '2022-08-31', '3123806215', 'calle 5A #23A-36', NULL, 'johanyjeison@gmail.com', '2022-09-01 01:56:34'),
(1077875339, 'JOHAN SEBASTIAN', 'FUENTES ORTEGA', 'M', '1998-01-12', '3217749146', 'calle 5A #23A-36', NULL, 'johan.fuentes01@uceva.edu.co', '2023-02-25 10:44:17'),
(1152461197, 'Jeison Andres', 'Fuentes Ortega', 'M', '1996-11-18', '3123806215', 'calle 5A #23A-36', 'Estudiante', 'jeyadrey16@gmail.com', '2022-08-21 06:46:10');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_etapaxxx`
--

CREATE TABLE `tbl_etapaxxx` (
  `codigoEtapaxxx` int(11) NOT NULL,
  `nombreEtapaxxx` varchar(15) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_etapaxxx`
--

INSERT INTO `tbl_etapaxxx` (`codigoEtapaxxx`, `nombreEtapaxxx`) VALUES
(1, 'Etapa 1'),
(2, 'Etapa 2'),
(3, 'Etapa 3'),
(4, 'Etapa 4');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_eventoxx`
--

CREATE TABLE `tbl_eventoxx` (
  `codigoEventoxx` int(11) NOT NULL,
  `codigoAdminxxx` int(11) NOT NULL,
  `nombreEventoxx` varchar(90) NOT NULL,
  `imagenEventoxx` varchar(120) NOT NULL,
  `descriEventoxx` text NOT NULL,
  `fechaxEventoxx` date NOT NULL,
  `horainEventoxx` time NOT NULL,
  `horafnEventoxx` time NOT NULL,
  `numeroEstadoxx` char(1) NOT NULL DEFAULT '1',
  `usuariModifica` varchar(90) DEFAULT NULL,
  `fechaxModifica` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_eventoxx`
--

INSERT INTO `tbl_eventoxx` (`codigoEventoxx`, `codigoAdminxxx`, `nombreEventoxx`, `imagenEventoxx`, `descriEventoxx`, `fechaxEventoxx`, `horainEventoxx`, `horafnEventoxx`, `numeroEstadoxx`, `usuariModifica`, `fechaxModifica`) VALUES
(4, 1, 'Evento de Proyección social', 'success.jpg', 'La proyección social ', '2023-07-23', '12:00:00', '14:00:00', '1', 'jansforte@gmail.com', '2023-05-08 14:59:51'),
(5, 1, 'Evento Empresarial', 'algo.png', 'Robotica Empresarial', '2023-03-21', '16:00:00', '18:00:00', '1', 'jansforte@gmail.com', '2023-03-08 00:18:23');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_grupdocn`
--

CREATE TABLE `tbl_grupdocn` (
  `codigoGrupdocn` int(11) NOT NULL,
  `codigoGrupoxxx` int(11) NOT NULL,
  `codigoDocentex` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_grupdocn`
--

INSERT INTO `tbl_grupdocn` (`codigoGrupdocn`, `codigoGrupoxxx`, `codigoDocentex`) VALUES
(17, 1, '1077875338'),
(25, 11, '62147528');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_grupoxxx`
--

CREATE TABLE `tbl_grupoxxx` (
  `codigoGrupoxxx` int(11) NOT NULL,
  `codigoEtapaxxx` int(11) NOT NULL,
  `nombreGrupoxxx` varchar(45) NOT NULL,
  `numeroEstadoxx` char(2) DEFAULT '1',
  `usuariCreacion` varchar(90) NOT NULL,
  `fechaxCreacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_grupoxxx`
--

INSERT INTO `tbl_grupoxxx` (`codigoGrupoxxx`, `codigoEtapaxxx`, `nombreGrupoxxx`, `numeroEstadoxx`, `usuariCreacion`, `fechaxCreacion`) VALUES
(1, 2, 'GRUPO 1', '1', '', '2023-09-20 00:04:22'),
(2, 2, 'Grupo 2', '1', '', '2023-03-20 11:44:41'),
(4, 3, 'Grupo Alfa', '1', '', '2023-05-04 23:14:25'),
(11, 1, 'GRUPO OTRO', '1', 'jansforte@gmail.com', '2023-09-21 23:37:25');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_grupstud`
--

CREATE TABLE `tbl_grupstud` (
  `codigoGrupstud` int(11) NOT NULL,
  `codigoGrupoxxx` int(11) NOT NULL,
  `codigoEstudnte` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_grupstud`
--

INSERT INTO `tbl_grupstud` (`codigoGrupstud`, `codigoGrupoxxx`, `codigoEstudnte`) VALUES
(2, 1, 1152461197),
(3, 2, 1077875338);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_histarea`
--

CREATE TABLE `tbl_histarea` (
  `codigoHistarea` int(11) NOT NULL,
  `codigoTareaxxx` int(11) NOT NULL,
  `descriTareaxxx` text NOT NULL,
  `archivAdjuntox` varchar(90) DEFAULT NULL,
  `numeroEstadoxx` char(3) DEFAULT '1',
  `usuariCreacion` varchar(90) NOT NULL,
  `fechaxCreacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_histarea`
--

INSERT INTO `tbl_histarea` (`codigoHistarea`, `codigoTareaxxx`, `descriTareaxxx`, `archivAdjuntox`, `numeroEstadoxx`, `usuariCreacion`, `fechaxCreacion`) VALUES
(1, 3, 'Se crea la tarea', '', '1', 'jansforte@gmail.com', '2023-09-03 16:25:54'),
(2, 3, 'ok', '', '3', 'jansforte@gmail.com', '2023-09-03 18:33:13'),
(3, 2, 'ok', '', '3', 'jansforte@gmail.com', '2023-09-03 18:46:57'),
(4, 2, 'hobo', 'hobogota.pdf', '3', 'jansforte@gmail.com', '2023-09-03 19:44:38'),
(5, 2, 'Debes mejorar', '', '4', 'jansforte@gmail.com', '2023-09-03 20:04:55'),
(6, 3, 'Se aprueba todo quedó bien', '', '3', 'jansforte@gmail.com', '2023-09-06 23:49:51'),
(7, 1, 'Devuelto como prueba', '', '4', 'jansforte@gmail.com', '2023-09-10 23:01:15'),
(8, 1, 'hola', '', '4', 'jansforte@gmail.com', '2023-09-10 23:02:15'),
(9, 1, 'otro', '', '4', 'jansforte@gmail.com', '2023-09-10 23:03:01'),
(10, 1, 'ok', '', '4', 'jansforte@gmail.com', '2023-09-10 23:08:30'),
(11, 1, 'nuevo intento', '', '4', 'jansforte@gmail.com', '2023-09-10 23:12:01'),
(12, 1, 'ok', '', '3', 'jansforte@gmail.com', '2023-09-10 23:12:16'),
(13, 2, 'Se devuelve por falta de pruebas', '', '4', 'jansforte@gmail.com', '2023-09-10 23:28:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_histnoti`
--

CREATE TABLE `tbl_histnoti` (
  `codigoHistnoti` int(11) NOT NULL,
  `codigoUsuariox` varchar(120) NOT NULL,
  `nombreNotifica` varchar(90) NOT NULL,
  `descriNotifica` text NOT NULL,
  `estadoNotifica` char(1) DEFAULT '0' COMMENT 'estado 0: sin leer, 1: leido',
  `tipoxxNotifica` varchar(60) NOT NULL COMMENT 'En este campo va la ruta donde se notifica',
  `fechaxCreacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_histnoti`
--

INSERT INTO `tbl_histnoti` (`codigoHistnoti`, `codigoUsuariox`, `nombreNotifica`, `descriNotifica`, `estadoNotifica`, `tipoxxNotifica`, `fechaxCreacion`) VALUES
(1, '1152461197', 'Etapa de Proyecto Completada', 'El revisa tu proyecto', '1', 'proyect', '2022-10-17 05:24:51'),
(2, '1152461197', 'Revisión de Proyecto', 'El Docente ha revisado tu proyecto', '0', 'proyect', '2022-10-17 05:30:53'),
(3, '11121131', 'Solicitud de Asesoria', 'El estudiante Jans Forte te pidió una solicitud de Asesoria', '1', 'meet', '2023-02-25 11:00:57'),
(4, '1077875338', 'Asesoria aceptada', 'El Docente ha aceptado tu asesoría', '1', 'meet', '2023-02-26 23:31:16'),
(5, '11121131', 'Solicitud de Asesoria', 'El estudiante Jans Forte te pidió una solicitud de Asesoria', '1', 'meet', '2023-02-27 22:42:54'),
(6, '1152461197', 'Revisión de Proyecto', 'El Docente ha revisado tu proyecto', '0', 'proyect', '2023-02-27 22:44:12'),
(7, '1077875338', 'Asesoria aceptada', 'El Docente ha aceptado tu asesoría', '1', 'meet', '2023-02-27 22:45:29'),
(8, '1152461197', 'Revisión de Proyecto', 'El Docente ha revisado tu proyecto', '0', 'proyect', '2023-03-05 23:21:19'),
(9, '1152461197', 'Revisión de Proyecto', 'El Docente ha revisado tu proyecto', '0', 'proyect', '2023-03-05 23:25:34'),
(10, '1077875338', 'Revisión de Proyecto', 'El Docente ha revisado tu proyecto', '1', 'proyect', '2023-03-05 23:30:42'),
(11, '11121131', 'Solicitud de Asesoria', 'El estudiante Jans Forte te pidió una solicitud de Asesoria', '1', 'meet', '2023-03-05 23:32:29'),
(12, '1077875338', 'Asesoria aceptada', 'El Docente ha aceptado tu asesoría', '1', 'meet', '2023-03-05 23:33:16'),
(13, '11121131', 'Solicitud de Asesoria', 'El estudiante Jans Forte te pidió una solicitud de Asesoria', '1', 'meet', '2023-04-16 18:25:13'),
(14, '1077875338', 'Solicitud de Asesoria', 'El estudiante Jans Forte te pidió una solicitud de Asesoria', '0', 'meet', '2023-05-08 15:09:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_perfilxx`
--

CREATE TABLE `tbl_perfilxx` (
  `codigoPerfilxx` int(11) NOT NULL,
  `nombrePerfilxx` varchar(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_perfilxx`
--

INSERT INTO `tbl_perfilxx` (`codigoPerfilxx`, `nombrePerfilxx`) VALUES
(1, 'Admin'),
(2, 'Profesor'),
(3, 'Estudiante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_proyecto`
--

CREATE TABLE `tbl_proyecto` (
  `codigoProyecto` int(11) NOT NULL,
  `codigoEstudnte` int(11) NOT NULL,
  `codigoEtapaxxx` int(11) DEFAULT 1,
  `codigoProystat` int(11) DEFAULT 1,
  `nombreProyecto` varchar(160) NOT NULL,
  `descriProyecto` text NOT NULL,
  `documeProyecto` varchar(120) NOT NULL,
  `fechaxRegistro` datetime NOT NULL,
  `observDocentex` text DEFAULT NULL,
  `fechaxDocentex` datetime DEFAULT NULL,
  `estadoNotifica` int(11) DEFAULT 0 COMMENT '0: sin notificar, 1:notifica estudiante, 2: notifica docente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_proyecto`
--

INSERT INTO `tbl_proyecto` (`codigoProyecto`, `codigoEstudnte`, `codigoEtapaxxx`, `codigoProystat`, `nombreProyecto`, `descriProyecto`, `documeProyecto`, `fechaxRegistro`, `observDocentex`, `fechaxDocentex`, `estadoNotifica`) VALUES
(1, 1152461197, 1, 2, 'Proyecto X', 'descri', 'Taller PT N3.docx', '2022-08-30 03:54:07', NULL, NULL, 0),
(2, 1077875338, 3, 1, 'Proyecto de johan', 'el proyecto es solo una prueba para validar que todo está funcionando bien', 'ejercicios 64-65-68-70-71.docx', '2022-09-01 01:57:42', 'Pasó a la siguiente etapa', '2023-03-05 23:30:41', 1),
(3, 1077875339, 3, 1, 'Sistema de Gestion', 'El sistema de gestion es un proyecto que se encarga de administrar los procesos de un ente como tal', 'Taller.docx', '2022-09-11 19:56:55', 'Pasó a la siguiente etapa', '2023-03-05 23:25:34', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_proystat`
--

CREATE TABLE `tbl_proystat` (
  `codigoProystat` int(11) NOT NULL,
  `nombreProystat` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_proystat`
--

INSERT INTO `tbl_proystat` (`codigoProystat`, `nombreProystat`) VALUES
(1, 'Sin Revisar'),
(2, 'Revisado'),
(3, 'Completado'),
(4, 'Terminado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_sliderxx`
--

CREATE TABLE `tbl_sliderxx` (
  `codigoSliderxx` int(11) NOT NULL,
  `codigoAdminxxx` int(11) NOT NULL,
  `nombreSliderxx` varchar(100) NOT NULL,
  `fechaxSliderxx` date NOT NULL,
  `imagenSliderxx` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_tareaxxx`
--

CREATE TABLE `tbl_tareaxxx` (
  `codigoTareaxxx` int(11) NOT NULL,
  `codigoProyecto` int(11) NOT NULL,
  `nombreTareaxxx` varchar(120) NOT NULL,
  `descriTareaxxx` text NOT NULL,
  `fechaxTareaxxx` date NOT NULL,
  `numeroEstadoxx` char(2) DEFAULT '1' COMMENT 'Estado 0, indica eliminado',
  `usuariCreacion` varchar(90) NOT NULL,
  `fechaxCreacion` datetime NOT NULL,
  `usuariModifica` varchar(90) DEFAULT NULL,
  `fechaxModifica` datetime DEFAULT NULL,
  `usuariGestionx` varchar(90) DEFAULT NULL,
  `fechaxGestionx` datetime DEFAULT NULL,
  `usuariAprobado` varchar(90) DEFAULT NULL,
  `fechaxAprobado` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_tareaxxx`
--

INSERT INTO `tbl_tareaxxx` (`codigoTareaxxx`, `codigoProyecto`, `nombreTareaxxx`, `descriTareaxxx`, `fechaxTareaxxx`, `numeroEstadoxx`, `usuariCreacion`, `fechaxCreacion`, `usuariModifica`, `fechaxModifica`, `usuariGestionx`, `fechaxGestionx`, `usuariAprobado`, `fechaxAprobado`) VALUES
(1, 2, 'Investigar Empresas', 'Investigar tipos de empresas y los productos de acuerdo a mi invento ', '2023-08-31', '1', 'jansforte@gmail.com', '2023-08-31 23:24:00', 'jansforte@gmail.com', '2023-09-10 23:26:55', 'jansforte@gmail.com', NULL, 'jansforte@gmail.com', '2023-09-10 23:12:16'),
(2, 2, 'tarea 2', 'ok ', '2023-09-04', '4', 'jansforte@gmail.com', '2023-09-03 16:24:06', 'jansforte@gmail.com', '2023-09-10 23:27:04', 'jansforte@gmail.com', NULL, NULL, NULL),
(3, 2, 'otro', 'fsdf', '2023-09-03', '3', 'jansforte@gmail.com', '2023-09-03 16:25:54', NULL, NULL, 'jansforte@gmail.com', '2023-09-03 18:33:13', 'jansforte@gmail.com', '2023-09-06 23:49:51');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tbl_usuarios`
--

CREATE TABLE `tbl_usuarios` (
  `emailxUsuariox` varchar(190) NOT NULL,
  `nombreUsuariox` varchar(120) NOT NULL,
  `clavexUsuariox` varchar(120) NOT NULL,
  `codigoPerfilxx` int(11) NOT NULL,
  `tokenxUsuariox` varchar(250) DEFAULT NULL,
  `picturUsuariox` char(1) DEFAULT '0',
  `fechaxIngresox` datetime DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

--
-- Volcado de datos para la tabla `tbl_usuarios`
--

INSERT INTO `tbl_usuarios` (`emailxUsuariox`, `nombreUsuariox`, `clavexUsuariox`, `codigoPerfilxx`, `tokenxUsuariox`, `picturUsuariox`, `fechaxIngresox`) VALUES
('jansforte@gmail.com', 'admin', '12345', 1, 'ya29.a0AWY7CkmFtJySjwpo3sp9qQTnJzp2xsb32NbiXiZc4wcm3g_i9Mo2BqHh92GXZT5cVQulASs6_TWxBweF6hrSx29tdkGepVsPDrhu5rB8dw3VvzNY-HIN9Rq0ybaiNH_BqtM5OOJW2QBkj5tLLm54S2fTGSTZsgaCgYKAQESARASFQG1tDrphEH7_95NKSaD9qO-M0eLYw0165', '1', '2023-09-12 22:37:25'),
('jeyadrey16@gmail.com', 'Jeison Andres Fuentes Ortega', '987', 3, NULL, '0', '2022-10-17 18:05:39'),
('johanyjeison@gmail.com', 'Jans Forte', '1234', 3, 'ya29.a0AbVbY6NjMxWP_tPiadJxNb55B9SiFyPkJDgprUG9AwPT7Ki5Z3zxEzb1eqocOtepR5tAQto5ZcRegHvW_phofavncK5x9gumhLZth4Z9EWoot-5TXa7PScearvKa_Sr22F-rwk42yoIlP61dT844pZMXUo5uaCgYKAbkSARISFQFWKvPlK0XjbQZvqQbpVA0w1XDouw0163', '0', '2023-07-29 16:05:08'),
('elpelosraspado@uceva.edu.co', 'El pelos raspado', '1234', 2, NULL, '0', '2023-05-20 16:10:57'),
('rherrera@uceva.edu.co', 'rodrigo herrera', 'root', 3, NULL, '0', '2023-05-08 14:50:46'),
('johan.fuentes@tendencyapps.com', 'Edwin Cardona', 'Casa2023', 2, NULL, '0', NULL),
('jorgemai@uceva.edu.co', 'Profesor Rogelio', 'Colombia12', 2, 'ya29.a0AVvZVspVNlZz0bqkvJeHcVYP0b4UkjGQd4pq7tFGVrd1T-6TbNnUiSMyuI_JXJfFk9WgtiBMbrmyjgXXuGqo95MDNPqApNEYqIuHA_YkFgDP3qkiUw3bxhA7HNY5b8vunj8trcp-n79pw7Lpp2-AbV5oWtSXSNQaCgYKAaoSARMSFQGbdwaIRompk9fQAETR9hua1-TIfg0166', '1', '2023-04-22 16:21:55');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `rcurso`
--
ALTER TABLE `rcurso`
  ADD PRIMARY KEY (`id_rcurso`),
  ADD KEY `id_estudiante` (`codigoEstudnte`);

--
-- Indices de la tabla `tbl_adminxxx`
--
ALTER TABLE `tbl_adminxxx`
  ADD PRIMARY KEY (`codigoAdminxxx`);

--
-- Indices de la tabla `tbl_asesoria`
--
ALTER TABLE `tbl_asesoria`
  ADD PRIMARY KEY (`codigoAsesoria`);

--
-- Indices de la tabla `tbl_asistenx`
--
ALTER TABLE `tbl_asistenx`
  ADD PRIMARY KEY (`codigoAsistenx`),
  ADD KEY `id_estudiante` (`codigoEstudnte`),
  ADD KEY `id_evento` (`codigoEventoxx`);

--
-- Indices de la tabla `tbl_casoexit`
--
ALTER TABLE `tbl_casoexit`
  ADD PRIMARY KEY (`codigoCasoexit`),
  ADD KEY `id_administrador` (`codigoAdminxxx`);

--
-- Indices de la tabla `tbl_curshora`
--
ALTER TABLE `tbl_curshora`
  ADD PRIMARY KEY (`codigoCurshora`);

--
-- Indices de la tabla `tbl_cursoxxx`
--
ALTER TABLE `tbl_cursoxxx`
  ADD PRIMARY KEY (`codigoCursoxxx`),
  ADD KEY `id_administrador` (`codigoAdminxxx`);

--
-- Indices de la tabla `tbl_docentex`
--
ALTER TABLE `tbl_docentex`
  ADD PRIMARY KEY (`codigoDocentex`),
  ADD KEY `id_administrador` (`codigoAdminxxx`),
  ADD KEY `id_estado` (`codigoEtapaxxx`);

--
-- Indices de la tabla `tbl_docnetap`
--
ALTER TABLE `tbl_docnetap`
  ADD PRIMARY KEY (`codigoDocnetap`);

--
-- Indices de la tabla `tbl_estatare`
--
ALTER TABLE `tbl_estatare`
  ADD PRIMARY KEY (`codigoEstatare`);

--
-- Indices de la tabla `tbl_estudisp`
--
ALTER TABLE `tbl_estudisp`
  ADD PRIMARY KEY (`codigoEstudisp`);

--
-- Indices de la tabla `tbl_estudnte`
--
ALTER TABLE `tbl_estudnte`
  ADD PRIMARY KEY (`codigoEstudnte`);

--
-- Indices de la tabla `tbl_etapaxxx`
--
ALTER TABLE `tbl_etapaxxx`
  ADD PRIMARY KEY (`codigoEtapaxxx`);

--
-- Indices de la tabla `tbl_eventoxx`
--
ALTER TABLE `tbl_eventoxx`
  ADD PRIMARY KEY (`codigoEventoxx`),
  ADD KEY `id_administrador` (`codigoAdminxxx`);

--
-- Indices de la tabla `tbl_grupdocn`
--
ALTER TABLE `tbl_grupdocn`
  ADD PRIMARY KEY (`codigoGrupdocn`);

--
-- Indices de la tabla `tbl_grupoxxx`
--
ALTER TABLE `tbl_grupoxxx`
  ADD PRIMARY KEY (`codigoGrupoxxx`),
  ADD KEY `id_estado` (`codigoEtapaxxx`);

--
-- Indices de la tabla `tbl_grupstud`
--
ALTER TABLE `tbl_grupstud`
  ADD PRIMARY KEY (`codigoGrupstud`);

--
-- Indices de la tabla `tbl_histarea`
--
ALTER TABLE `tbl_histarea`
  ADD PRIMARY KEY (`codigoHistarea`);

--
-- Indices de la tabla `tbl_histnoti`
--
ALTER TABLE `tbl_histnoti`
  ADD PRIMARY KEY (`codigoHistnoti`);

--
-- Indices de la tabla `tbl_perfilxx`
--
ALTER TABLE `tbl_perfilxx`
  ADD PRIMARY KEY (`codigoPerfilxx`);

--
-- Indices de la tabla `tbl_proyecto`
--
ALTER TABLE `tbl_proyecto`
  ADD PRIMARY KEY (`codigoProyecto`),
  ADD KEY `id_estudiante` (`codigoEstudnte`),
  ADD KEY `id_estado` (`codigoEtapaxxx`),
  ADD KEY `codigoProystat` (`codigoProystat`);

--
-- Indices de la tabla `tbl_proystat`
--
ALTER TABLE `tbl_proystat`
  ADD PRIMARY KEY (`codigoProystat`);

--
-- Indices de la tabla `tbl_sliderxx`
--
ALTER TABLE `tbl_sliderxx`
  ADD PRIMARY KEY (`codigoSliderxx`),
  ADD KEY `id_administrador` (`codigoAdminxxx`);

--
-- Indices de la tabla `tbl_tareaxxx`
--
ALTER TABLE `tbl_tareaxxx`
  ADD PRIMARY KEY (`codigoTareaxxx`);

--
-- Indices de la tabla `tbl_usuarios`
--
ALTER TABLE `tbl_usuarios`
  ADD PRIMARY KEY (`emailxUsuariox`),
  ADD KEY `codigoPerfilxx` (`codigoPerfilxx`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `tbl_asesoria`
--
ALTER TABLE `tbl_asesoria`
  MODIFY `codigoAsesoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `tbl_curshora`
--
ALTER TABLE `tbl_curshora`
  MODIFY `codigoCurshora` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=91;

--
-- AUTO_INCREMENT de la tabla `tbl_cursoxxx`
--
ALTER TABLE `tbl_cursoxxx`
  MODIFY `codigoCursoxxx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_docnetap`
--
ALTER TABLE `tbl_docnetap`
  MODIFY `codigoDocnetap` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `tbl_estatare`
--
ALTER TABLE `tbl_estatare`
  MODIFY `codigoEstatare` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `tbl_estudisp`
--
ALTER TABLE `tbl_estudisp`
  MODIFY `codigoEstudisp` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `tbl_etapaxxx`
--
ALTER TABLE `tbl_etapaxxx`
  MODIFY `codigoEtapaxxx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_eventoxx`
--
ALTER TABLE `tbl_eventoxx`
  MODIFY `codigoEventoxx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `tbl_grupdocn`
--
ALTER TABLE `tbl_grupdocn`
  MODIFY `codigoGrupdocn` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT de la tabla `tbl_grupoxxx`
--
ALTER TABLE `tbl_grupoxxx`
  MODIFY `codigoGrupoxxx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `tbl_grupstud`
--
ALTER TABLE `tbl_grupstud`
  MODIFY `codigoGrupstud` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tbl_histarea`
--
ALTER TABLE `tbl_histarea`
  MODIFY `codigoHistarea` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `tbl_histnoti`
--
ALTER TABLE `tbl_histnoti`
  MODIFY `codigoHistnoti` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `tbl_perfilxx`
--
ALTER TABLE `tbl_perfilxx`
  MODIFY `codigoPerfilxx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `tbl_proyecto`
--
ALTER TABLE `tbl_proyecto`
  MODIFY `codigoProyecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_proystat`
--
ALTER TABLE `tbl_proystat`
  MODIFY `codigoProystat` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `tbl_tareaxxx`
--
ALTER TABLE `tbl_tareaxxx`
  MODIFY `codigoTareaxxx` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `rcurso`
--
ALTER TABLE `rcurso`
  ADD CONSTRAINT `rcurso_ibfk_2` FOREIGN KEY (`codigoEstudnte`) REFERENCES `tbl_estudnte` (`codigoEstudnte`);

--
-- Filtros para la tabla `tbl_asistenx`
--
ALTER TABLE `tbl_asistenx`
  ADD CONSTRAINT `tbl_asistenx_ibfk_1` FOREIGN KEY (`codigoEstudnte`) REFERENCES `tbl_estudnte` (`codigoEstudnte`),
  ADD CONSTRAINT `tbl_asistenx_ibfk_2` FOREIGN KEY (`codigoEventoxx`) REFERENCES `tbl_eventoxx` (`codigoEventoxx`);

--
-- Filtros para la tabla `tbl_casoexit`
--
ALTER TABLE `tbl_casoexit`
  ADD CONSTRAINT `tbl_casoexit_ibfk_1` FOREIGN KEY (`codigoAdminxxx`) REFERENCES `tbl_adminxxx` (`codigoAdminxxx`);

--
-- Filtros para la tabla `tbl_cursoxxx`
--
ALTER TABLE `tbl_cursoxxx`
  ADD CONSTRAINT `tbl_cursoxxx_ibfk_1` FOREIGN KEY (`codigoAdminxxx`) REFERENCES `tbl_adminxxx` (`codigoAdminxxx`);

--
-- Filtros para la tabla `tbl_docentex`
--
ALTER TABLE `tbl_docentex`
  ADD CONSTRAINT `tbl_docentex_ibfk_1` FOREIGN KEY (`codigoAdminxxx`) REFERENCES `tbl_adminxxx` (`codigoAdminxxx`),
  ADD CONSTRAINT `tbl_docentex_ibfk_2` FOREIGN KEY (`codigoEtapaxxx`) REFERENCES `tbl_etapaxxx` (`codigoEtapaxxx`);

--
-- Filtros para la tabla `tbl_eventoxx`
--
ALTER TABLE `tbl_eventoxx`
  ADD CONSTRAINT `tbl_eventoxx_ibfk_1` FOREIGN KEY (`codigoAdminxxx`) REFERENCES `tbl_adminxxx` (`codigoAdminxxx`);

--
-- Filtros para la tabla `tbl_grupoxxx`
--
ALTER TABLE `tbl_grupoxxx`
  ADD CONSTRAINT `tbl_grupoxxx_ibfk_2` FOREIGN KEY (`codigoEtapaxxx`) REFERENCES `tbl_etapaxxx` (`codigoEtapaxxx`);

--
-- Filtros para la tabla `tbl_proyecto`
--
ALTER TABLE `tbl_proyecto`
  ADD CONSTRAINT `tbl_proyecto_ibfk_1` FOREIGN KEY (`codigoEstudnte`) REFERENCES `tbl_estudnte` (`codigoEstudnte`),
  ADD CONSTRAINT `tbl_proyecto_ibfk_2` FOREIGN KEY (`codigoEtapaxxx`) REFERENCES `tbl_etapaxxx` (`codigoEtapaxxx`),
  ADD CONSTRAINT `tbl_proyecto_ibfk_3` FOREIGN KEY (`codigoProystat`) REFERENCES `tbl_proystat` (`codigoProystat`);

--
-- Filtros para la tabla `tbl_sliderxx`
--
ALTER TABLE `tbl_sliderxx`
  ADD CONSTRAINT `tbl_sliderxx_ibfk_1` FOREIGN KEY (`codigoAdminxxx`) REFERENCES `tbl_adminxxx` (`codigoAdminxxx`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
