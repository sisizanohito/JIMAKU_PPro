/***********************************************************************/
/*                                                                     */
/* SPBasic.h                                                           */
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

#ifndef __SPBasic__
#define __SPBasic__

/*******************************************************************************
 **
 **	Imports
 **
 **/

#include "SPTypes.h"

#ifdef __cplusplus
extern "C" {
#endif

/*******************************************************************************
 **
 **	Constants
 **
 **/

#define kSPBasicSuite				"SP Basic Suite"
#define kSPBasicSuiteVersion		4

/*******************************************************************************
 **
 **	Suite
 **
 **/

typedef struct SPBasicSuite {

	SPAPI SPErr (*AcquireSuite)( const char *name, long version, const void **suite );
	SPAPI SPErr (*ReleaseSuite)( const char *name, long version );
	SPAPI SPBoolean (*IsEqual)( const char *token1, const char *token2 );
	SPAPI SPErr (*AllocateBlock)( long size, void **block );
	SPAPI SPErr (*FreeBlock)( void *block );
	SPAPI SPErr (*ReallocateBlock)( void *block, long newSize, void **newblock );
	SPAPI SPErr (*Undefined)( void );

} SPBasicSuite;

SPAPI SPErr SPBasicAcquireSuite( const char *name, long version, const void **suite );
SPAPI SPErr SPBasicReleaseSuite( const char *name, long version );
SPAPI SPBoolean SPBasicIsEqual( const char *token1, const char *token2 );
SPAPI SPErr SPBasicAllocateBlock( long size, void **block );
SPAPI SPErr SPBasicFreeBlock( void *block );
SPAPI SPErr SPBasicReallocateBlock( void *block, long newSize, void **newblock );
SPAPI SPErr SPBasicUndefined( void );

/*******************************************************************************
 **
 **	Errors
 **
 **/

#include "SPErrorCodes.h"

#ifdef __cplusplus
}
#endif

#endif
