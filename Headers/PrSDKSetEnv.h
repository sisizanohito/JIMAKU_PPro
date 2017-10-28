/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2002 Adobe Systems Incorporated                       */
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

/*		
	PrSDKSetEnv.h

	Part of the Adobe Premiere SDK.
*/

#ifndef PRSDKSETENV_H
#define PRSDKSETENV_H

#ifdef __APPLE__
	#define PRMAC_ENV
	#undef PRWIN_ENV
//	#pragma options align=mac68k ??
#endif

#ifndef PRWIN_ENV
	#if defined(_WIN32) || defined(_WIN64)
		#define PRWIN_ENV
		#undef PRMAC_ENV
	#endif
#endif

#ifndef CSSDK_TARGET_ARCH_X64
	#define CSSDK_TARGET_ARCH_X64	0
	#if defined(__x86_64__) || defined(_M_X64)
		#undef CSSDK_TARGET_ARCH_X64
		#define CSSDK_TARGET_ARCH_X64		1
	#endif
#endif


#endif // PRSDKSETENV_H