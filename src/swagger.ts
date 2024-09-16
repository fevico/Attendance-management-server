const options = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: "Swagger Documentation For Attendance tracking system",
            version: "1.0.0",
            description: "API for attendance tracking system",
        },
        servers:[
            {
                url: "https://attendance-management-server-g57k.onrender.com/",
                description: "Local server",
            }
        ],
        components:{
            schemas:{
                Users:{
                    type: "object",
                    required: ["name", "email", "password"],
                    properties:{
                        name:{ 
                            type: "string",
                            format: "name",
                            default: "John Doe",
                            description: "User's name"
                        },
                       email:{ 
                            type: "string",
                            format: "email",
                            default: "example@example.com",
                            description: "User's email address"
                        },
                        password:{
                            type: "string",
                            format: "password",
                            description: "User's password",
                            default: "examplePassword"
                        },
                        
                    }
                },
                Courses:{
                    type: "object",
                    required: ["name", "email", "password"],
                    properties:{
                        name:{ 
                            type: "string",
                            format: "name",
                            default: "John Doe",
                            description: "User's name"
                        },
                       email:{ 
                            type: "string",
                            format: "email",
                            default: "example@example.com",
                            description: "User's email address"
                        },
                        password:{
                            type: "string",
                            format: "password",
                            description: "User's password",
                            default: "examplePassword"
                        },
                        
                    }
                },

            },

            responses:{
                200:{
                    description: "Success",
                    content: "application/json"
                },
                400:{
                    description: "Bad Request",
                    content: "application/json"
                },
                404:{
                    description: "Request Not Found",
                    content: "application/json"
                },
                403:{
                    description: "Unauthorized Request",
                    content: "application/json"
                },
                422:{
                    description: "Unprocessed Request user already exists",
                    content: "application/json"
                },
                500:{
                    description: "Internal Server Error",
                    content: "application/json"
                }
            },
            securitySchemes: {
                ApiKeyAuth:{
                    type: "apikey",
                    in: "header",
                    name: "Authorization",
                }
            }
        },
        security:[{
            ApiKeyAuth:[],
        }]
    },
    apis:[ 
        "./src/routes/auth.ts",
        "./src/routes/course.ts",
   ]
};

export default options;
