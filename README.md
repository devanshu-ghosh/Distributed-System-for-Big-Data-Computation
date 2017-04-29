# Distributed-System-for-Big-Data-Computation

# AIM 

We have a Data Emmiting Server which has a lot of data stored . We want to perform some computations
on that data . 

# APPROACH 

My approach is to divide the data into smaller chuncks each identified by a unique ID and perform computaions not at the server but at the PEERS/CLIENTS who have connected to the Server via SOCKET connection . 

# TOOLS

**Backend**

Node.js Server using Express.js

Socket.io to establish Socket Connections

QueueJS to implement Queue Data Structure 

**Frontend** 

Angular Frontend 

Very primitive


# TO DO

1. Implement Global in memory data-result store
2. Implement FunctionSignature Concept : 
Each computation is characterized by its corresponding function . Like ArraySum,FrequencyOfWords etc . Our system hence will ask the socket connection to choose one of the type of computation it wants to perform . Once selected , we will pass this choice to generateData function as well as to the Client . Hence we have made the system independent of a particular task . New computation type adding is just a function away . 

# Components 

1. Data Emmiting Server : 
This server is a continuous supply of Data on which computation 
has to be performed . We keep on polling this server to get data for our WorkerQueue

2. Worker Queue : 
This is a QUEUE designed to send the data to Client . 
As soon as a Client connects , it starts polling for data by sending "GET DATA" messages
via the socket connection . 
Every T sec , we poll Data Emitting Server and enqueue data into WorkerQueue . 
Data is characterised by a unique 16 Byte Hex Id . 
data.id : Stores id
data.data : Array storing the data 

3. Data Sent Map : 
This Map stores the Data Sent . We maintain this to ensure that all data 
gets computed without fail . If a client doesnt returns the answer , we should reenqueue the data . 
This has not been implemeted at this point . 

4. ANS : 
This object [Later DB to store answers] stores id:result pairs . Keeps track of all the
answers calculated . 

# Event Trace via Socket.io

1. Every T sec , data gets enqueue in WorkerQueue .
2. Every T sec , we will check for NACK in future implementations 
3. As soon as the client establishes a Socket connection , it starts sending "GET DATA" at 1sec rate . 
4. SERVER gets "getData" , checks if queue has data or not . If data present , SERVER sends back data using "takeData". Else "Data Queue Empty" event .
5. CLIENT on "takeData" event , start computation of data got and returns the result in "result" event . We also send the ID 
6. At SERVER , we store the answer in ANS , delete the ID from DSM . 
