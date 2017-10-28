/*******************************************************************/
/*                                                                 */
/*                      ADOBE CONFIDENTIAL                         */
/*                   _ _ _ _ _ _ _ _ _ _ _ _ _                     */
/*                                                                 */
/* Copyright 2011 Adobe Systems Incorporated                       */
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


#include "ControlSurfaceMixerBase.h"

// adobesdk
#include "adobesdk/controlsurface/plugin/ControlSurfaceMixerSuite.h"

namespace adobesdk
{
	namespace
	{
	
		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetChannelState(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannel,
			uint32_t						inChannelStateIndex,
			ADOBESDK_Boolean				inState)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetChannelState(inChannel, inChannelStateIndex, !!inState);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_GetMaxChannelStripCount(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t*						outChannelStripCount)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->GetMaxChannelStripCount(outChannelStripCount);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_ChannelConfigChanged(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannelID,
			uint32_t						inSelector)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->ChannelConfigChanged(inChannelID, inSelector);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SelectionChanged(
			ADOBESDK_ControlSurfaceMixerRef inTransportRef)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SelectionChanged();
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetAutomationMode(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannel,
			uint32_t						inAutomationMode)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetAutomationMode(inChannel, inAutomationMode);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetChannelOffset(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannelOffset)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetChannelOffset(inChannelOffset);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetChannelCount(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannelCount)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetChannelCount(inChannelCount);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetRudeSoloState(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			ADOBESDK_Boolean				inValue)
		{
			return reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetRudeSoloState(!!inValue);
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetComponentBypass(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannelID,
			uint32_t						inComponentIndex,
			ADOBESDK_Boolean				inBypass)
		{
			reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetComponentBypass(inChannelID, inComponentIndex, !!inBypass);
			return kSPNoError;
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		SPErr ControlSurface_SetComponentParameter(
			ADOBESDK_ControlSurfaceMixerRef	inTransportRef,
			uint32_t						inChannelID,
			uint32_t						inComponentIndex,
			uint32_t						inParameterIndex,
			float							inValue)
		{
			reinterpret_cast<ControlSurfaceMixerBase*>(inTransportRef)->SetComponentParameter(inChannelID, inComponentIndex, inParameterIndex, inValue);
			return kSPNoError;
		}

		//////////////////////////////////////////////////////////////////////////////
		///
		ADOBESDK_ControlSurfaceMixerSuite1 sControlSurfaceMixerSuite =
		{
			ControlSurface_GetMaxChannelStripCount,
			ControlSurface_ChannelConfigChanged,
			ControlSurface_SelectionChanged,
			ControlSurface_SetChannelState,
			ControlSurface_SetAutomationMode,
			ControlSurface_SetChannelOffset,
			ControlSurface_SetChannelCount,
			ControlSurface_SetRudeSoloState,
			ControlSurface_SetComponentBypass,
			ControlSurface_SetComponentParameter
		};

	} // namespace

		
	//////////////////////////////////////////////////////////////////////////////
	///
	ControlSurfaceMixerBase::ControlSurfaceMixerBase()
	{
	}
	
	//////////////////////////////////////////////////////////////////////////////
	///
	ControlSurfaceMixerBase::~ControlSurfaceMixerBase()
	{
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::GetMaxChannelStripCount(uint32_t* /* outMaxChannelStripCount */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::ChannelConfigChanged(uint32_t /* inChannelID */, uint32_t /* inSelector */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SelectionChanged()
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetChannelState(uint32_t /* inChannelID */, uint32_t /* inChannelStateIndex */, bool /* inState */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetAutomationMode(uint32_t /* inChannelID */, uint32_t /* inAutomationMode */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetChannelOffset(uint32_t /* inChannelOffset */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetChannelCount(uint32_t /* inChannelCount */)
	{
		return kSPUnimplementedError;
	}
	
	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetRudeSoloState(bool /* inValue */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetComponentBypass(uint32_t /* inChannelID */, uint32_t /* inComponentIndex */, bool /* inBypass */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	SPErr ControlSurfaceMixerBase::SetComponentParameter(uint32_t /* inChannelID */, uint32_t /* inComponentIndex */, uint32_t /* inParameterIndex */, float /* inValue */)
	{
		return kSPUnimplementedError;
	}

	//////////////////////////////////////////////////////////////////////////////
	///
	void ControlSurfaceMixerBase::RegisterSuite(SPSuitesSuite* inSPSuitesSuite, SPSuiteListRef inSuiteList)
	{
		SPSuiteRef controlSurfaceMixerSuiteRef = 0;
		inSPSuitesSuite->AddSuite(
			inSuiteList,
			NULL,
			kADOBESDK_ControlSurfaceMixerSuite,
			kADOBESDK_ControlSurfaceMixerSuite_Version1,
			kADOBESDK_ControlSurfaceMixerSuite_Version1,
			&sControlSurfaceMixerSuite,
			&controlSurfaceMixerSuiteRef);
	}

} // namespace adobesdk

