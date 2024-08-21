'use client';

import { Box, Button, Dialog, Flex, Heading, Section, Table, Tabs, Text, TextField } from '@radix-ui/themes';
import React from 'react'

type Props = {
	children: React.ReactNode;
	addNode: (label: string) => void;
	nodes: any;
	edges: any;
	resetFlow: () => void;
}

const Index = ({ children, addNode, nodes, edges, resetFlow }: Props) => {

	const [label, setLabel] = React.useState('New Node')
	const [open, setOpen] = React.useState(false)

	return (
		<Section className="sidebar">
			<Heading as="h3" style={{
				// paddingLeft: 10
			}}>Settings</Heading>

			<Box mt="4">
				<Tabs.Root defaultValue="nodes">
					<Tabs.List>
						<Tabs.Trigger value="nodes">Nodes</Tabs.Trigger>
						<Tabs.Trigger value="edges">Edges</Tabs.Trigger>
					</Tabs.List>

					<Box pt="3">
						<Tabs.Content value="nodes">
							<Flex direction={'column'} gap="3">

								<Table.Root>
									<Table.Header>
										<Table.Row>
											<Table.ColumnHeaderCell>Id</Table.ColumnHeaderCell>
											<Table.ColumnHeaderCell>Label</Table.ColumnHeaderCell>
										</Table.Row>
									</Table.Header>

									<Table.Body>
										{
											nodes.map((node: any, index: any) => (
												<Table.Row key={index}>
													<Table.Cell>{node.id}</Table.Cell>
													<Table.Cell>{node.data.label}</Table.Cell>
												</Table.Row>
											))
										}
									</Table.Body>
								</Table.Root>

								<Dialog.Root open={open} onOpenChange={setOpen}>
									<Dialog.Trigger>
										<Button mt={"3"}>Create a Node</Button>
									</Dialog.Trigger>

									<Dialog.Content maxWidth="450px">
										<Dialog.Title>Create a Node</Dialog.Title>
										<Dialog.Description size="2" mb="4">
											Add a new node by filling out the form below.
										</Dialog.Description>

										<Flex direction="column" gap="3">
											<label>
												<Text as="div" size="2" mb="1" weight="bold">
													Label
												</Text>
												<TextField.Root
													name="label"
													value={label}
													placeholder="Enter the label of the node"
													onChange={(e) => setLabel(e.target.value)}
												/>
											</label>
										</Flex>

										<Flex gap="3" mt="4" justify="end">
											<Dialog.Close>
												<Button variant="soft" color="gray">
													Cancel
												</Button>
											</Dialog.Close>

											<Button disabled={label.length < 1} onClick={() => {
												addNode && addNode(label);
												setOpen(false)
											}}>
												Add Node
											</Button>

										</Flex>
									</Dialog.Content>
								</Dialog.Root>
							</Flex>

						</Tabs.Content>

						<Tabs.Content value="edges">
							<Table.Root>
								<Table.Header>
									<Table.Row>
										<Table.ColumnHeaderCell>Source</Table.ColumnHeaderCell>
										<Table.ColumnHeaderCell>Target</Table.ColumnHeaderCell>
									</Table.Row>
								</Table.Header>

								<Table.Body>
									{
										edges.map((edge: any, index: any) => (
											<Table.Row key={index}>
												<Table.Cell>{edge.source}</Table.Cell>
												<Table.Cell>{edge.target}</Table.Cell>
											</Table.Row>
										))
									}
								</Table.Body>
							</Table.Root>
						</Tabs.Content>


					</Box>
				</Tabs.Root>

				<Button color='red' style={{
					width: "100%",
					marginTop: "20px"
				}} onClick={() => resetFlow()}>Reset</Button>

				{/* {children} */}
			</Box>
		</Section>
	)
}

export default Index
