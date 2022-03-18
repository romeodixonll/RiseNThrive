import { gql } from "@apollo/client";

export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        
      }
    }
  }
`;

export const SAVE_OPTIONS = gql`
  mutation addOptions($optionsData: OptionInput){
    addOptions(optionsData: $optionsData){
      _id
      savedOptions{
        optionId
        options
      }
    }
  }

`

export const REMOVE_OPTIONS = gql`
  mutation removeOptions($optionId: ID!){
    removeOptions(optionId: $optionId){
      _id
      savedOptions{
        optionId
        options
      }
    }
  }

`



export const ADD_USER = gql`
  mutation addUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
  ) {
    addUser(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
    ) {
      token
      user {
        _id
      }
    }
  }
`;

export const ADD_STAT = gql`
mutation addStat(
  $userId: String,
  $highScore: Int, 
  $guess1: Int, 
  $guess2: Int, 
  $guess3: Int, 
  $guess4: Int, 
  $guess5: Int, 
  $guess6: Int, 
  $guess7: Int, 
  $guess8: Int, 
  $averageTries: Float, 
  $gamesPlayed: Int
  ) {
    addStat(
      userId: $userId
      highScore: $highScore
      guess1: $guess1
      guess2: $guess2
      guess3: $guess3
      guess4: $guess4
      guess5: $guess5
      guess6: $guess6
      guess7: $guess7
      guess8: $guess8
      averageTries: $averageTries
      gamesPlayed: $gamesPlayed
      ) {
          _id
          userId
          highScore
          guess1
          guess2
          guess3
          guess4
          guess5
          guess6
          guess7
          guess8
          averageTries
          gamesPlayed
      }
}
`


export const ADD_TASK = gql`
  mutation AddTask($task: String!) {
    addTask(task: $task) {
      _id
      taskItem
      completed
    }
  }
`;

export const UPDATE_TRIES = gql`
  mutation updateTries($tries: Int, $average: Float,) {
    updateTries(tries: $tries, average: $average,) {
      _id
      userId
      highScore
      guess1
      guess2
      guess3
      guess4
      guess5
      guess6
      guess7
      guess8
      averageTries
      gamesPlayed
    }
  }
`

export const UPDATE_TASK = gql`
mutation Mutation($taskId: ID!, $taskItem: String, $taskStatus: Boolean) {
  updateTask(taskId: $taskId, taskItem: $taskItem, taskStatus: $taskStatus) {
    _id
    taskItem
    completed
  }
}
`