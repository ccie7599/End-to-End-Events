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
