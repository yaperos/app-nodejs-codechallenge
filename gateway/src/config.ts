export const microservices = ["transactions", "antifraud"] as const;
export type Microservice = (typeof microservices)[number];

export type MicroserviceConfig = {
  name: Microservice;
  port: number;
  inputTopics?: string[];
  routes?: {
    path: string;
    methods: ("get" | "post" | "put" | "delete")[];
  }[];
};

export const microservicesConfig: MicroserviceConfig[] = [
  {
    name: "antifraud",
    port: 3001,
    inputTopics: ["transactions.create.done"],
  },
  {
    name: "transactions",
    port: 3002,
    inputTopics: ["antifraud.update.done"],
    routes: [
      {
        path: "/transactions",
        methods: ["post"],
      },
      {
        path: "/transactions/:id",
        methods: ["get"],
      },
    ],
  },
];
