export const chatSample = [
  {
    avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
    name: "John Doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
    name: "Yogesh Mahajan",
    _id: "2",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
    name: "Dinesh Mahajan",
    _id: "3",
    groupChat: false,
    members: ["1", "2"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
    name: "John Doe",
    _id: "1",
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
    name: "John Doe",
    _id: "2",
  },
];

export const sampleNotifi = [
  {
    sender: {
      avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
      name: "Yo Doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
      name: "John Doe",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "ssdd",
        url: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      },
    ],
    _id: "sksklnklj.kjbn",
    sender: {
      _id: "user._id",
      name: "YoBro",
    },
    chat: "ChahId",
    createdAt: "2024-09-12T10:41:30.630Z",
  },
  {
    attachments: [],
    content: "This is a message 2",
    _id: "j.kjbn",
    sender: {
      _id: "dddd",
      name: "ruhul",
    },
    chat: "ChahId",
    createdAt: "2024-09-12T10:41:30.630Z",
  },
];

export const dashboardData = {
  users: [
    {
      name: "John Doe",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      _id: "1",
      username: "john_doe",
      friends: 20,
      groups: 3,
    },
    {
      name: "Yo noe",
      avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      _id: "2",
      username: "Yo_name",
      friends: 26,
      groups: 4,
    },
  ],

  chats: [
    {
      name: "Coders group",
      avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
      _id: "1",
      groupChat: false,
      members: [
        {
          _id: "1",
          avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        },
        {
          _id: "2",
          avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        },
      ],
      totalMembers: 2,
      totalMessages: 20,
      creator: {
        name: "Yo dan",
        avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      },
    },
    {
      name: "SSVPS Group",
      avatar: ["https://cdn-icons-png.flaticon.com/512/6858/6858504.png"],
      _id: "2",
      groupChat: false,
      members: [
        {
          _id: "1",
          avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        },
        {
          _id: "2",
          avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        },
      ],
      totalMembers: 5,
      totalMessages: 37,
      creator: {
        name: "Rahul rajput",
        avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
      },
    },
  ],

  message: [
    {
      attachments: [
        {
          public_id: "kmknknj",
          url: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        },
      ],
      content: "Massage hai",
      _id: "mnkbhmbbbnb",
      sender: {
        avatar: "https://cdn-icons-png.flaticon.com/512/6858/6858504.png",
        name: "chaman",
      },
      chat: "chatid",
      groupChat: true,
      createdAt: "2024-02-12T10:41:30.630Z",
    },
  ],
};
