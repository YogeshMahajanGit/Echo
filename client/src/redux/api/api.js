import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { server } from "../../constants/config";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/v1/` }),
  tagTypes: ["Chat", "User", "Message"],

  endpoints: (builder) => ({
    // my chat endpoint
    myChats: builder.query({
      query: () => ({
        url: "chats/my",
        credentials: "include",
      }),
      providesTags: ["Chat"],
    }),

    // search user endpoint
    searchUser: builder.query({
      query: (name) => ({
        url: `users/search?name=${name}`,
        credentials: "include",
      }),
      providesTags: ["User"],
    }),

    // send request endpoint
    sendFriendRequest: builder.mutation({
      query: (data) => ({
        url: "/users/send-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // get notification of other user endpoint
    getNotification: builder.query({
      query: () => ({
        url: "/users/notifications",
        credentials: "include",
      }),
      //no caching
      keepUnusedDataFor: 0,
    }),

    // accept request endpoint
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: "/users/accept-request",
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    // get chat details endpoint
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chats/${chatId}`;
        if (populate) url += "populate=true";

        return {
          url,
          credentials: "include",
        };
      },
      providesTags: ["Chat"],
    }),

    // get my chat endpoint /message/:id
    getMyMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chats/message/${chatId}?page=${page}`,
        credentials: "include",
      }),
      keepUnusedDataFor: 0,
    }),

    // send attachment endpoint
    sendAttachments: builder.mutation({
      query: (data) => ({
        url: `chats/message`,
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
  }),
});

export default api;

export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
  useGetNotificationQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMyMessagesQuery,
  useSendAttachmentsMutation,
} = api;
