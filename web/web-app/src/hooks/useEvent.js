import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useSelector, useDispatch } from 'react-redux';
import { serviceAddTicketTypes, serviceUpdateTicketTypes, serviceUpsertTicketTypes } from "../services/ticketService";
import {
    buildMomoCheckoutPayload,
    buildVnPayCheckoutPayload,
    serviceCreateMomoCheckout,
    serviceCreateVnPayCheckout,
} from "../services/paymentService";

export const asyncThunkUpsertTicketTypesDB = createAsyncThunk(
    "eventSlice/asyncThunkUpsertTicketTypesDB",
    async (ticketTypes) => {
        const payload = ticketTypes.map(({ fakeId, ...rest }) => rest)
        const result = await serviceUpsertTicketTypes(payload)
        if (result.status !== 200) {
            throw Error("Không thể gửi dữ liệu tới database")
        }
        return result.data.body
    }
)

const eventSlice = createSlice({
    name: "eventSlice",
    initialState: {
        eventPerformances: [],
        ticketTypes: [],
        selectedEvent: { id: 1 },
        venue: { id: 1 },
        hasChange: false,
        hasChangeTicketTypes: false,
        bookingOrder: null,
        bookingOrderItems: [],
        bookingCheckoutContext: null,
        bookingPayment: null,
    },
    reducers: {
        reducerAddPerformance: (state) => {
            const nextId = state.eventPerformances.length
            state.eventPerformances.push({
                id: nextId,
                eventId: state.selectedEvent.id,
                venueId: state.venue.id,
                startTime: undefined,
                entTime: undefined,
                totalCapacity: 0,
                availableCapacity: 0,
                status: "OPEN"
            })
        },
        reducerUpdatePerformanceTime: (state, action) => {
            const { id, field, value } = action.payload
            const performance = state.eventPerformances.find((p) => p.id === id)
            if (!performance) return

            if (field === 'startTime') {
                performance.startTime = value
            }

            if (field === 'endTime') {
                performance.entTime = value
            }
        },
        reducerAddTicketType: (state, action) => {
            const nextId = state.ticketTypes.length
            state.ticketTypes.push({
                fakeId: nextId,
                performanceId: action.payload.performanceId,
                id: action.payload.id,
                name: action.payload.name,
                price: action.payload.price,
                totalQuantity: action.payload.totalQuantity,
                maxTicketsPerUser: action.payload.maxTicketsPerUser,
                version: 0
            })
            state.hasChangeTicketTypes = true
        },
        reducerUpdateTicketType: (state, action) => {
            const ticketTypeIndex = state.ticketTypes.findIndex(t => t.fakeId === action.payload.fakeId)
            if (ticketTypeIndex !== -1) {
                state.ticketTypes[ticketTypeIndex] = {
                    ...state.ticketTypes[ticketTypeIndex],
                    ...action.payload
                }
                state.hasChangeTicketTypes = true
            }
        },
        reducerSetBookingOrderData: (state, action) => {
            state.bookingOrder = action.payload?.order ?? null
            state.bookingOrderItems = action.payload?.orderItems ?? []
            state.bookingCheckoutContext = action.payload?.context ?? null
        },
        reducerClearBookingOrderData: (state) => {
            state.bookingOrder = null
            state.bookingOrderItems = []
            state.bookingCheckoutContext = null
            state.bookingPayment = null
        },
        reducerSetBookingPaymentData: (state, action) => {
            state.bookingPayment = action.payload ?? null
        },
        reducerClearBookingPaymentData: (state) => {
            state.bookingPayment = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(asyncThunkUpsertTicketTypesDB.fulfilled, (state, action) => {
            state.ticketTypes = action.payload.map((t, i) => ({...t, fakeId: i}))
            state.hasChangeTicketTypes = false
        })
        .addCase(asyncThunkUpsertTicketTypesDB.rejected, (state) => {
            state.hasChangeTicketTypes = true
        })
    }
})

export const {
    reducerAddPerformance,
    reducerUpdatePerformanceTime,
    reducerUpdateTicketType,
    reducerAddTicketType,
    reducerSetBookingOrderData,
    reducerClearBookingOrderData,
    reducerSetBookingPaymentData,
    reducerClearBookingPaymentData,
} = eventSlice.actions
export const eventReducer = eventSlice.reducer;
export const eventStore = configureStore({
    reducer: {
        eventSlice: eventReducer,
    },
});

export const useEvent = () => {
    const {
        eventPerformances,
        ticketTypes,
        bookingOrder,
        bookingOrderItems,
        bookingCheckoutContext,
        bookingPayment,
    } = useSelector((state) => state.eventSlice);
    const dispatch = useDispatch();

    const addPerformance = (performance) => dispatch(reducerAddPerformance(performance))
    const updatePerformanceTime = (payload) => dispatch(reducerUpdatePerformanceTime(payload))
    const updateTicketType = (ticketType) => dispatch(reducerUpdateTicketType(ticketType))
    const addTicketType = (ticketType) => dispatch(reducerAddTicketType(ticketType))
    const setBookingOrderData = (payload) => dispatch(reducerSetBookingOrderData(payload))
    const clearBookingOrderData = () => dispatch(reducerClearBookingOrderData())
    const setBookingPaymentData = (payload) => dispatch(reducerSetBookingPaymentData(payload))
    const clearBookingPaymentData = () => dispatch(reducerClearBookingPaymentData())
    const addTicketTypesDB = (ticketTypes) => serviceAddTicketTypes(ticketTypes)
    const updateTicketTypesDB = (ticketTypes) => serviceUpdateTicketTypes(ticketTypes)
    const upsertTicktTypesDB = (ticketTypes) => dispatch(asyncThunkUpsertTicketTypesDB(ticketTypes)).unwrap()

    const createVnPayCheckout = async ({ order, event, showtime, returnUrl }) => {
        const payload = buildVnPayCheckoutPayload({ order, event, showtime, returnUrl })
        const response = await serviceCreateVnPayCheckout(payload)
        setBookingPaymentData({
            provider: 'VNPAY',
            request: payload,
            response,
            createdAt: new Date().toISOString(),
        })
        return response
    }

    const createMomoCheckout = async ({ order, event, showtime, returnUrl }) => {
        const payload = buildMomoCheckoutPayload({ order, event, showtime, returnUrl })
        const response = await serviceCreateMomoCheckout(payload)
        setBookingPaymentData({
            provider: 'MOMO',
            request: payload,
            response,
            createdAt: new Date().toISOString(),
        })
        return response
    }

    return {
        eventPerformances,
        ticketTypes,
        addPerformance,
        updatePerformanceTime,
        updateTicketType,
        addTicketType,
        bookingOrder,
        bookingOrderItems,
        bookingCheckoutContext,
        bookingPayment,
        setBookingOrderData,
        clearBookingOrderData,
        setBookingPaymentData,
        clearBookingPaymentData,
        createVnPayCheckout,
        createMomoCheckout,
        addTicketTypesDB,
        updateTicketTypesDB,
        upsertTicktTypesDB
    }
}