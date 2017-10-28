/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2000-2008 Adobe Systems Incorporated                  */
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

//	This file is part of the public Premiere SDK.

/* prSDKTypes.h

Defines common types used by the various Premiere interfaces.

*/

#ifndef PRSDKTYPES_H
#define PRSDKTYPES_H

#include "PrSDKSetEnv.h"

#ifdef PRWIN_ENV

//  Make sure Windows doesn't define the min & max macros,
//  which collide with std min & max in numerous ways, particularly
//  apparent when using non-Microsoft implementations of the
//  C++ standard library.
#define NOMINMAX

#ifndef _WINDOWS_
#include <windows.h>
#endif

#elif defined(PRMAC_ENV)
#include <stdint.h>

#if __OBJC__
	// forward declare for Objective-C/C++ (Cocoa type)
	@class NSView;
	@class NSWindow;
#else
	// forward declare for C++ (opaque, only useful with a pointer type)
	struct NSView;
	struct NSWindow;
#endif

#include <Carbon/Carbon.h>

#endif


#pragma pack(push, 1)

#ifdef __cplusplus
extern "C" {
#endif

// Locally defined SDK ints.
// Microsoft does not support C99, so we make our own definitions
#ifdef PRWIN_ENV
typedef signed char			csSDK_int8;
typedef short int			csSDK_int16;
typedef int					csSDK_int32;
typedef signed __int64		csSDK_int64;

typedef	unsigned char		csSDK_uint8;
typedef	unsigned short int	csSDK_uint16;
typedef unsigned int		csSDK_uint32;
typedef unsigned __int64	csSDK_uint64;

#elif defined(PRMAC_ENV)

typedef int8_t				csSDK_int8;
typedef int16_t				csSDK_int16;
typedef int32_t				csSDK_int32;
typedef int64_t				csSDK_int64;

typedef uint8_t				csSDK_uint8;
typedef uint16_t			csSDK_uint16;
typedef uint32_t			csSDK_uint32;
typedef uint64_t			csSDK_uint64;

#endif

#if CSSDK_TARGET_ARCH_X64
	typedef csSDK_uint64	csSDK_size_t;
#else
	typedef csSDK_uint32	csSDK_size_t;
#endif

typedef char* PrMemoryPtr;
typedef PrMemoryPtr * PrMemoryHandle;			/*  pointer to a master pointer */

#ifndef	kPrMaxPath
#define kPrMaxPath 260
#endif

#ifndef MAX_FXALIAS
#define MAX_FXALIAS 32
#endif
/* non-platform-specific items */

typedef csSDK_uint32	prColor;
typedef csSDK_uint32	PrFourCC;

/* pixel aspect ratio value */

typedef	csSDK_uint32 prPixelAspectRatio;

#define kPrMaxName		kPrMaxPath

#ifdef PRMAC_ENV
// [FIX ME] this won't work w/o carbon
typedef Rect prRect;

#ifndef CALLBACK
#define CALLBACK
#endif

#endif

#ifdef PRWIN_ENV
typedef RECT prRect;
#endif

typedef struct
{
	csSDK_int32 x;
	csSDK_int32 y;
} prPoint;

typedef struct
{
	double x;
	double y;
} prFPoint64;

typedef struct 
{
	csSDK_uint8 blue;
	csSDK_uint8 green;
	csSDK_uint8 red;
	csSDK_uint8 alpha;
} prPixel;

typedef struct 
{
	float left;			
	float top;			
	float right;			
	float bottom;			
} prFloatRect;

typedef struct 
{
	csSDK_int32	day;
	csSDK_int32	month;
	csSDK_int32	year;

	csSDK_int32 hours;
	csSDK_int32 minutes;
	double seconds;
} prDateStamp;

/*
**	Plugin bool support
*/
typedef csSDK_int32	prBool;
const	prBool	kPrTrue = 1;
const	prBool	kPrFalse = 0;

typedef csSDK_uint8 prUTF8Char;

#ifdef PRWIN_ENV

typedef HRGN		prRgn;
typedef HWND		prWnd;
typedef HWND		prParentWnd;
typedef HDC			prOffScreen;
typedef wchar_t		prUTF16Char;
typedef csSDK_int64 prInt64;

#elif defined(PRMAC_ENV)

typedef NSView*						prWnd;			// Consistent with PlatformViewPtr (Cocoa 64-bit)
typedef NSWindow*					prParentWnd;	// normally not used on Mac, but consistent with PlatformWindowPtr (Cocoa 64-bit)
typedef struct OpaquePrRgn*			prRgn;			// not used on Mac, here only for cross-platform compatibility
typedef struct OpaquePrOffscreen*	prOffScreen;	// not used on Mac, here only for cross-platform compatibility
typedef csSDK_int64					prInt64;
typedef csSDK_uint16				prUTF16Char;

#endif



/*
** SDK Strings 
**	This type defines the client storage needed to hold an SDK appropriate string reference. 
**	All SDK strings must be allocated and disposed using the PrSDKStringSuite
**	String data is opaque, and can only be read/written using methods in PrSDKStringSuite
*/
typedef struct 
{
	csSDK_int64 opaque[2];
} PrSDKString; 

/*
**	Define to force an enum to an int size
*/
#define kPrForceEnumToIntValue 0xFFFFFFFF

/* PPix struct definition */
typedef struct 
{
	prRect			bounds;			/* bounds (always 0,0 origin!) */
	csSDK_int32	rowbytes;		/* rowbytes */
	csSDK_int32	bitsperpixel;	/* currently always 32 */
	void*	pix;			/* the pixels (not accessible) */
	void*	reserved[32];	/* internal data (see ppix_fields.h) */
} PPix, *PPixPtr, **PPixHand;

#ifndef PWorldID
typedef	csSDK_int16 PWorldID;
#endif

#ifndef prFieldType
typedef csSDK_int32 prFieldType;		

#define prFieldsNone			0	// Full frame
#define prFieldsUpperFirst		1	// topmost line is dominant
#define prFieldsLowerFirst		2	// topmost+1 line is dominant
#define prFieldsUnknown			3	// has fields, unknown dominance
#define prFieldsAny				4	// supports any field type
#define prFieldsInvalid			-1	// unknown if fields, thus invalid
#endif  /* prFieldType*/

typedef csSDK_int32	PrTimelineID;
typedef csSDK_int32	PrClipID;

//	A GUID string in the form xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx, NULL terminated
typedef struct
{
	char	mGUID[37];
} prPluginID;

namespace 
{
	inline void prSetRect(prRect* outRect, int inLeft, int inTop, int inRight, int inBottom)
	{
		outRect->left = inLeft;
		outRect->top = inTop;
		outRect->right = inRight;
		outRect->bottom = inBottom;
	}

	inline void prUTF16CharCopy(prUTF16Char* outDest, const prUTF16Char* inSrc)
	{
		if (outDest && inSrc)
		{
			for(;*inSrc; ++outDest, ++inSrc)
			{
				*outDest = *inSrc;
			}
			*outDest = 0;
		}
	}

	inline int prUTF16CharCompare(const prUTF16Char* inLHS, const prUTF16Char* inRHS)
	{
		if (inLHS && inRHS)
		{
			for(;*inLHS && *inRHS; ++inLHS, ++inRHS)
			{
				if (*inLHS < *inRHS)
				{
					return -1;
				}
				if (*inRHS < *inLHS)
				{
					return 1;
				}
			}
			if (*inLHS)
			{
				return 1;
			}
			if (*inRHS)
			{
				return -1;
			}
		}
		return 0;
	}
	
	inline int prUTF16CharLength(const prUTF16Char* inStr)
	{
		int ret = 0;
		if (inStr)
		{
			for (;*inStr; ++inStr, ++ret)
			{}
		}
		return ret;
	}

} // anonymous namespace

enum PrParamType
{
	kPrParamType_Int8 = 1,	
	kPrParamType_Int16,	
	kPrParamType_Int32,	
	kPrParamType_Int64,
	kPrParamType_Float32,
	kPrParamType_Float64,
	kPrParamType_Bool,
	kPrParamType_Point,
	kPrParamType_Guid,
	kPrParamType_PrMemoryPtr,
	kPrParamType_MaxSize = kPrForceEnumToIntValue
};

struct PrParam
{
	PrParamType			mType;
	union
	{
		csSDK_int8		mInt8;
		csSDK_int16		mInt16;
		csSDK_int32		mInt32;
		csSDK_int64		mInt64;
		float			mFloat32;
		double			mFloat64;
		csSDK_uint8		mBool;
		prFPoint64		mPoint;
		prPluginID		mGuid;
		PrMemoryPtr		mMemoryPtr;
	};
};

#ifdef __cplusplus
}
#endif

#pragma pack(pop)

#endif	/* PRSDKTYPES_H */
