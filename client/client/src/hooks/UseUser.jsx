import React from 'react'

function UseUser() {
  return (
    {
        id: document.cookie.match(/userId=(?<id>[^;]+);?$/).groups.id
    }
)
}

export default UseUser