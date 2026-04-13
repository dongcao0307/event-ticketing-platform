import { configureStore, createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { useSelector, useDispatch } from 'react-redux';
import { serviceAddTicketTypes, serviceUpdateTicketTypes, serviceUpsertTicketTypes } from "../services/ticketService";

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
        hasChangeTicketTypes: false
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

export const { reducerAddPerformance, reducerUpdatePerformanceTime, reducerUpdateTicketType, reducerAddTicketType } = eventSlice.actions
export const eventReducer = eventSlice.reducer;
export const eventStore = configureStore({
    reducer: {
        eventSlice: eventReducer,
    },
});

export const useEvent = () => {
    const { eventPerformances, ticketTypes } = useSelector((state) => state.eventSlice);
    const dispatch = useDispatch();

    const addPerformance = (performance) => dispatch(reducerAddPerformance(performance))
    const updatePerformanceTime = (payload) => dispatch(reducerUpdatePerformanceTime(payload))
    const updateTicketType = (ticketType) => dispatch(reducerUpdateTicketType(ticketType))
    const addTicketType = (ticketType) => dispatch(reducerAddTicketType(ticketType))
    const addTicketTypesDB = (ticketTypes) => serviceAddTicketTypes(ticketTypes)
    const updateTicketTypesDB = (ticketTypes) => serviceUpdateTicketTypes(ticketTypes)
    const upsertTicktTypesDB = (ticketTypes) => dispatch(asyncThunkUpsertTicketTypesDB(ticketTypes)).unwrap()

    return {
        eventPerformances,
        ticketTypes,
        addPerformance,
        updatePerformanceTime,
        updateTicketType,
        addTicketType,
        addTicketTypesDB,
        updateTicketTypesDB,
        upsertTicktTypesDB
    }
}