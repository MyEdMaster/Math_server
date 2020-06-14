//api document

------------  problem  ----------------
1. 
Description: get all problems in the DB
method: GET
url: /problem
body: null
response:
    [{
        "id":2,
        "name":"test2",
        "description":"test2",
        "parameter_number":2,
        "start_format":"test"
    },
    {
        ......
    }
    ]
2. 
Description: get problem by id
method: GET
url: /problem/:id
body: null
response:
    [{
        "id":2,
        "name":"test2",
        "description":"test2",
        "parameter_number":2,
        "start_format":"test"
    }]
3.
Description: create new problem
method: POST
url: /problem
body: {
        "id":2,
        "name":"test2",
        "description":"test2",
        "parameter_number":2,
        "start_format":"test"
      }
response:

4.
Description: modify the problem
method: PUT
url: /problem
body: {
         "id":2,
         "name":"test2",
         "description":"test2",
         "parameter_number":2,
         "start_format":"test"
       }
response:

----------  second_level_parameter ---------
5.
Description:find all second_level_parameter with given problrem_ID
method: POST
url: /second_level_parameter
body:{
        "problem_ID": 2
     }
response:
    [{
        "id":1,
        "problem_ID":3,
        "format":"2+3"
    }]

6.
Description: create new second_level_parameter
method: POST
url: /second_level_parameter_create
body:
         {
             "problem_ID":3,
             "format":"2+3"
         }
response:

7.
Description: modify the second_level_parameter
method: PUT
url: /second_level_parameter
body:
         {
             "id":1,
             "problem_ID":3,
             "format":"2+3"
         }
response:
    
--------------  step -----------------
8.
Description: find all second_level_parameter with given problrem_ID
method: POST
url: /step
body:
     {
        "problem_ID": 2
     }
response:
[{
        "id":1,
        "problem_ID":3,
        "name":"test",
        "feed_back":"test",
        "step_number":0,
        "type":1,
        "finish":1,
        "format":"2+3"
 }]

9.
Description: create new step
method: POST
url: /step_create
body: {
              "problem_ID":3,
              "name":"test",
              "feed_back":"test",
              "step_number":0,
              "type":1,
              "finish":1,
              "format":"2+3"
       }
response:

10.
Description: modify step
method: PUT
url: /step
body:{
             "id":1,
             "problem_ID":3,
             "name":"test",
             "feed_back":"test",
             "step_number":0,
             "type":1,
             "finish":1,
             "format":"2+3"
      }
response: