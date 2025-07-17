# End-to-End-Events

This repository is a simple framework for extending real-time events beyond a cloud provider's network and into a distributed edge platform. 

Examples of use of this framework include distribution of real-time information to large audiences spread throughout a wide geographic area (intra-continental or global). Specific types of real-time information include-

* Sports scores and results
* Weather information
* News and other real-time events
* Financial quotes and data 

## High-Level Architecture 

![pubsub ref arch  drawio](https://github.com/user-attachments/assets/47052dde-78ee-4514-87ce-ef0ae3d3abe3)

## Architecture Components 

The framework assumes that a source-of-truth data origin already exists and is hosted within a cloud provider envirnoments. The framework gives examoples of connecting to a structured data platform (such as MySQL), an unstructured platform such as Dynamo or Mongo, and an event-driven platform such as Redis. 

The componentry, working from the inside out, includes-

* A process that interfaces a distributed Edge database with the origin source of truth. This could include consumption of Change Data Captures (CDCs), messasges from an event-driven system, or subscriptions to a data stream of any unstructured platfrom. The process also optionally includes data transformations if needed (for example, transforming the result of a SQL-based CDC to a json object).

The repository includes an example of connecting Redis to a distributed message queue via subscription. Such connectors can be very simple and lightweight, as the example shows. 

* A distributed edge database platform, with nodes placed in locations that are proximate to end-users. While optional, a edge node can be placed within the origin VPC, to allow for less latent and more reliable syncronization between the origin and edge DB.

* A Content Delivery Network (CDN) to provide content distribution and security, and to offload Layer 3 / Layer 4 connections from the Edge Database.

## Client Interfaces

THe repository includes examples of Websocket, Server-Sent-Events, and API interfaces to the event system. Each protoocl has ideal use cases- 

* Websockets can be used for bi-directional communication to and from the user, and in cases where the event data is specific to a user.

* Server-Sent Events are good for unidicrectional event broadcasting to the entire population or to large groups.

* API interfaces can be used when clients are unable to support SSE or websockets, or when client flow requires a polling of current state.

Additionally, the system cna be used with native protocols (such as MQTT over TLS), within platforms such as mobile applications, and offer better performance with lower overhead. 

# Live Events Demo

Included in this repository are components built for a hyperscale (10 Million+ Concurrent users), low-latency (10-50ms RTT from user to edge), bidirectional realtime public-facing system. 

[index.js] - sample lambda code to be triggered by AWS Simple Notification Service (SNS), forwarding SNS events to a distributed edge event platform. 

[stamped.js] - nodejs function that taps event stream to add metrics and metadata to the event, and taps acknowledgement stream to calculate RTT latency for metrics publishing. 

[events.html](events.html) - demo web application showing event feed with latency meaurements, and realtime state table and RTT latency of all connected users, and their shared location on a map. 


