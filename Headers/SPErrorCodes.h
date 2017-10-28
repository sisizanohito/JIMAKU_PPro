/***********************************************************************/
/*                                                                     */
/* SPErrorCodes.h                                                      */
/*                                                                     */
/* (c) Copyright 1995-1999, 2002 Adobe Systems Incorporated.                     */
/* All Rights Reserved.                                                */
/*                                                                     */
/* Patents Pending                                                     */
/*                                                                     */
/* NOTICE: All information contained herein is the property of Adobe   */
/* Systems Incorporated. Many of the intellectual and technical        */
/* concepts contained herein are proprietary to Adobe, are protected   */
/* as trade secrets, and are made available only to Adobe licensees    */
/* for their internal use. Any reproduction or dissemination of this   */
/* software is strictly forbidden unless prior written permission is   */
/* obtained from Adobe.                                                */
/*                                                                     */
/***********************************************************************/
/* $Id: $  */
/* $DateTime: $  */
/* $Change: $  */
/* $Author: $  */

/*******************************************************************************
 **
 ** General Errors
 **
 **/

// General errors
#define kASNoError				0x00000000L
#define kASUnimplementedError	'!IMP'	
#define kASUserCanceledError	'stop'

/*******************************************************************************
 **
 ** SP Errors
 **
 **/

// General errors
#define kSPNoError				0x00000000L
#define kSPUnimplementedError	'!IMP'	
#define kSPUserCanceledError	'stop'
#define kSPOperationInterrupted				'intr'
#define	kSPLogicError						'fbar' // general programming error

// SPAccessSuite errors
#define kSPCantAcquirePluginError			'!Acq'
#define kSPCantReleasePluginError			'!Rel'
#define kSPPluginAlreadyReleasedError		'AlRl'

// SPAdaptsSuite errors
#define kSPAdapterAlreadyExistsError		'AdEx'
#define kSPBadAdapterListIteratorError		'BdAL'

// SPBasicSuite errors
#define kSPBadParameterError				'Parm'	

// Block debugging errors
#define kSPCantChangeBlockDebugNowError		'!Now'
#define kSPBlockDebugNotEnabledError		'!Nbl'

// SPBlocks errors
#define kSPOutOfMemoryError					0xFFFFFF6cL  /* -108, same as Mac memFullErr */
#define kSPBlockSizeOutOfRangeError			'BkRg'

// SPCaches errors
#define kSPPluginCachesFlushResponse		'pFls'
#define kSPPluginCouldntFlushResponse		kSPNoError;

// SPFiles errors
#define kSPTroubleAddingFilesError			'TAdd'
#define kSPBadFileListIteratorError			'BFIt'

// SPHost errors
#define kSPTroubleInitializingError			'TIni'	// Some non-descript problem encountered while starting up.
#define kHostCanceledStartupPluginsError 	'H!St'

// SPInterface errors
#define kSPNotASweetPeaPluginError			'NSPP'
#define kSPAlreadyInSPCallerError			'AISC'

// SPPlugins errors
#define kSPUnknownAdapterError				'?Adp'
#define kSPBadPluginListIteratorError		'PiLI'
#define kSPBadPluginHost					'PiH0'
#define kSPCantAddHostPluginError			'AdHo'
#define kSPPluginNotFound					'P!Fd'

// SPProperties errors
#define kSPCorruptPiPLError					'CPPL'
#define kSPBadPropertyListIteratorError		'BPrI'

// SPSuites errors
#define kSPSuiteNotFoundError				'S!Fd'	
#define kSPSuiteAlreadyExistsError			'SExi'	
#define kSPSuiteAlreadyReleasedError		'SRel'	
#define kSPBadSuiteListIteratorError		'SLIt'	
#define kSPBadSuiteInternalVersionError		'SIVs'	
