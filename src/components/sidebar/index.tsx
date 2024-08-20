import React from 'react'

const Index = ({ children }: {
    children: React.ReactNode
}) => {
    return (
        <aside className="sidebar">
            this is another test

            {children}
        </aside>
    )
}

export default Index
