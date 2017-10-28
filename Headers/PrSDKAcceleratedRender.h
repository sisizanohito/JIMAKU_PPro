/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2008 Adobe Systems Incorporated                       */
/* All Rights Reserved.                                            */
/*                                                                 */
/* NOTICE:  All information contained herein is, and remains the   */
/* property of Adobe Systems Incorporated and its suppliers, if    */
/* any.  The intellectual and technical concepts contained         */
/* herein are proprietary to Adobe Systems Incorporated and its    */
/* suppliers and may be covered by U.S. and Foreign Patents,       */
/* patents in process, and are protected by trade secret or        */
/* copyright law.  Dissemination of this information or            */
/* reproduction of this material is strictly forbidden unless      */
/* prior written permission is obtained from Adobe Systems         */
/* Incorporated.                                                   */
/*                                                                 */
/*******************************************************************/

#ifndef PRSDKACCELERATEDRENDER_H
#define PRSDKACCELERATEDRENDER_H

#ifndef PRSDKTYPES_H
#include "PrSDKTypes.h"
#endif

#ifndef PRSDKENTRY_H
#include "PrSDKEntry.h"
#endif

#ifndef PRSDKPLAYMODULE_H
#include "PrSDKPlayModule.h"
#endif

#ifndef PRSDKPLUGSUITES_H
#include "PrSDKPlugSuites.h"
#endif

#ifndef PRSDKQUALITY_H
#include "PrSDKQuality.h"
#endif

#ifndef PRSDKPIXELFORMAT_H
#include "PrSDKPixelFormat.h"
#endif

#ifndef PRSDKSTREAMLABEL_H
#include "PrSDKStreamLabel.h"
#endif

#ifndef PRSDKTIMESUITE_H
#include "PrSDKTimeSuite.h"
#endif

#ifndef	PRSDKIMPORTERSHARED_H
#include "PrSDKImporterShared.h"
#endif

#ifndef __SPBasic__
#include "SPBasic.h"
#endif

#pragma pack(push, 1)

#ifdef __cplusplus
extern "C" {
#endif

#define prAcceleratedRendererVersion100	1 // CS4
#define prAcceleratedRendererVersion200	2 // CS5
#define prAcceleratedRendererVersion300	3 // CS5.0.1
#define prAcceleratedRendererVersion400	4 // CS5.5
#define prAcceleratedRendererVersion500	5 // CS6
#define prAcceleratedRendererVersion600	6 // CS7
#define prAcceleratedRendererVersion700	7 // CC8
#define RENDERMOD_VERSION	prAcceleratedRendererVersion700

#define prHideRendererInUI -100

typedef struct
{
	prPluginID outIdentifier;
	// 0 is the priority of the host renderer - a plugin generally wants to be higher
	// <0 implies the accelerator is not enabled by default
	// <= prHideRenderInUI is self explanatory
	int outPriority;
	prUTF16Char outDisplayName[256];
} arRendererInfo;

typedef struct
{
	int inInterfaceVer; //RENDERMOD_VERSION
	int inPluginID;
	int inIndex;
	void* ioPluginPrivateInstanceData; //Set during arSelector_Startup, available during all other selectors, and cleaned up during arSelector_Shutdown

	piSuites* (*inGetPluginInterfaceSuiteCallback)();
} arStdParms;

typedef struct
{
	PrTimelineID inTimelineID;
	int inExportFlags;
	PrTime inTimelineFrameRate;
	int inTimelineWidth;
	int inTimelineHeight;
	csSDK_uint32 inTimelinePARNum;
	csSDK_uint32 inTimelinePARDen;
	prFieldType inTimelineFieldType;

	void* ioPrivatePluginSequenceData; //Set during arSelector_SequenceSetup, cleaned up during arSelector_SequenceSetdown
	PrSDKStreamLabel inStreamLabel;
} arSequenceData;

typedef struct
{
	PrTime inStartTime; //provided by the host - will start at time zero and will iterate
	PrTime outEndTime; //Filled in by the plugin
	int outStatus; //see the arSegmentStatus enum
} arVideoSegmentInfo;

typedef struct
{
	arVideoSegmentInfo inSegmentInfo;
	int inPixelFormatIndex;
	PrPixelFormat outPixelFormat;
} arVideoSegmentPixelFormat;

enum
{
	arCompletion_Success = 0,
	arCompletion_Error = -1,
	arCompletion_Cancelled = -2
};

typedef void (*AcceleratedRendererCompletionCallback)(void* inCallbackData, csSDK_int32 inRequestID, PPixHand inPPix, int inCompletion);

typedef struct
{
	PrTime inTime; //TODO two times for the two fields? Or do we rely on the sequence frame rate?
	int inWidth;
	int inHeight;
	csSDK_uint32 inPARNum;
	csSDK_uint32 inPARDen;
	PrPixelFormat inPixelFormat;
	PrRenderQuality inQuality;
	bool inPrefetchOnly;
	bool inCompositeOnBlack;

	AcceleratedRendererCompletionCallback inCompletionCallback;
	void* inCompletionCallbackData;
	csSDK_int32 inRequestID;//provided by the host, used to cancel the request

	bool inRenderFields;
	imRenderContext mRenderContext;
} arRenderRequest;

#define SDKAcceleratedRendererEntryPointName		"xRendererEntry"
typedef PREMPLUGENTRY (* AcceleratedRendererEntryFunc)(int selector, arStdParms* stdParms, void* param1, void* param2);

typedef enum
{
	arSegmentStatus_CannotRender = 0,
	arSegmentStatus_CanRender_NonRealTimeUnspecified = 1,
	arSegmentStatus_CanRender_RealTime = 2,
	arSegmentStatus_CanRender_RealTimeWithMismatch = 3,
	arSegmentStatus_CanRender_RealTimeCached = 4,

	arSegmentStatus_CanRender = arSegmentStatus_CanRender_NonRealTimeUnspecified
} arSegmentStatus;

enum
{
	arTimelineFlag_UseExistingPreviewFiles = 0x1 //A sequence will be setup twice, once with this flag and once without
};

// Selectors
enum PrRendererSelector
{
	arSelector_Startup = 0, //arRendererInfo, unused
	arSelector_Shutdown = 1,//unused, unused
	
	arSelector_SequenceSetup = 2, //arSequenceData, unused
	arSelector_SequenceSetdown = 3,//arSequenceData, unused
	
	arSelector_IterateVideoSegments = 4,//arSequenceData, arVideoSegmentInfo
	arSelector_IterateVideoSegmentPixelFormats = 5,//arSequenceData, arVideoSegmentPixelFormat
	
	arSelector_InitiateFrameRender = 6,//arSequenceData, arRenderRequest
	arSelector_CancelFrameRender = 7,//arSequenceData, renderRequestID
	arSelector_CancelAllFrameRenders = 8,//arSequenceData, unused

	arSelector_SetDisplayStateProperties = 9,//arSequenceData, const pmDisplayStateProperties*
};

// Return codes
enum PrRendererReturn
{
	arReturn_Success = 0,
	
	arReturn_ContinueIterateRenderers = 1, //used during Startup to support multiple renderers in a single plugin
	arReturn_ContinueIterateVideoSegments = 2,
	arReturn_ContinueIteratePixelFormats = 5,
	
	arReturn_ErrorUnknown = -1,
	arReturn_ErrorMemory = -2,
	arReturn_ErrorHost = -3,
	arReturn_ErrorUnsupported = -4
};

#ifdef __cplusplus
}
#endif

#pragma pack(pop)

#endif //PRSDKACCELERATEDRENDER_H