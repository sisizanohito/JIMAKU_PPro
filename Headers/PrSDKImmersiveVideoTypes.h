/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2016 Adobe Systems Incorporated                       */
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
/* Adobe Premiere Play Module plug-in definitions				   */
/*																   */
/*******************************************************************/

#ifndef	PRSDKIMMERSIVEVIDEOTYPES_H
#define PRSDKIMMERSIVEVIDEOTYPES_H

#ifndef PRSDKTYPES_H
#include "PrSDKTypes.h"
#endif

#pragma pack(push, 1)

#ifdef __cplusplus
extern "C" {
#endif

/**
**	Types used to describe different aspects of immersive/VR/360 video
*/

/**
**	Defines how the VR image is projected into a 2D frame.
*/
typedef enum 
{
	kPrIVProjectionType_None				= 0,	// The video frame does not contain any immersive video projection
	kPrIVProjectionType_Equirectangular		= 1		// The video frame contains a equirectangular image
} PrIVProjectionType;

/**
**	Defines if the VR image contains a stereoscopic pair, and if so, what type of pair.
*/
typedef enum
{
	kPrIVFrameLayout_Monoscopic				= 0,	// The video frame contains a single monoscopic image
	kPrIVFrameLayout_StereoscopicOverUnder	= 1,	// The video frame contains a stereoscopic pair, with the left eye image placed above the right
	kPrIVFrameLayout_StereoscopicSideBySide	= 2		// The video frame contains a stereoscopic pair, with the left eye image placed to the left of the right
} PrIVFrameLayout;

/**
**	Defines which eye to view when given a VR image with a stereoscopic pair.
*/
typedef enum
{
	kPrIVStereoscopicEye_Left				= 0,	// View just the left eye when provided a stereoscopic pair
	kPrIVStereoscopicEye_Right				= 1,	// View just the right eye when provided a stereoscopic pair
	kPrIVStereoscopicEye_Anaglyph			= 2		// View as a combined anaglyph (red/cyan) image when provided a stereoscopic pair
} PrIVStereoscopicEye;

#ifdef __cplusplus
}
#endif

#pragma pack(pop)

#endif /* PRSDKIMMERSIVEVIDEOTYPES_H */
