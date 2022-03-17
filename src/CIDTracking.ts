import { BigInt } from '@graphprotocol/graph-ts'
import { AddManager, RemoveManager, FreeBalance, SyncStorage, Insert, Remove, Update } from './types/CIDTracking/CIDTracking'
import { Manager, Balance, CIDTrace } from './types/schema'

export function handleAddManager(event: AddManager): void {
	const managerAddress = event.params.manager.toHex()
	let manager = Manager.load(managerAddress)
	if (!manager) {
		manager = new Manager(managerAddress)
		manager.address = event.params.manager
		manager.status = "added"
		manager.save()
	}
}

export function handleRemoveManager(event: RemoveManager): void {
	const managerAddress = event.params.manager.toHex()
	let manager = Manager.load(managerAddress)
	if (manager) {
		manager = new Manager(managerAddress)
		manager.address = event.params.manager
		manager.status = "removed"
		manager.save()
	}
}

export function handleFreeBalance(event: FreeBalance): void {
	const account = event.params.to
	let balance = Balance.load(account.toHex())
	if (!balance) {
		balance = new Balance(account.toHex())
	}
	balance.total = event.params.total
	balance.cost = event.params.cost
	balance.expiration = event.params.expiration
	balance.save()
}

export function handleSyncStorage(event: SyncStorage): void {
	const account = event.params.to
	let balance = Balance.load(account.toHex())
	if (!balance) {
		balance = new Balance(account.toHex())
		balance.cost = BigInt.fromU32(0)
	}
	balance.total = event.params.amount
	balance.expiration = event.params.expiration
	balance.save()
}

export function handleInsert(event: Insert): void {
	const id = `${event.params.to.toHex()}-${event.params.cid}`
	let trace = CIDTrace.load(id)
	if (!trace) {
		trace = new CIDTrace(id)
		trace.account = event.params.to
		trace.cid = event.params.cid
		trace.size = event.params.size
		trace.expiration = event.params.expiration
		trace.originalSize = BigInt.fromU32(0)
		trace.timestamp = event.block.timestamp
		trace.txHash = event.transaction.hash
		trace.status = "Inserted"
		trace.save()
	}
}

export function handleRemove(event: Remove): void {
	const id = `${event.params.to.toHex()}-${event.params.cid}`
	let trace = CIDTrace.load(id)
	if (trace) {
		trace = new CIDTrace(id)
		trace.expiration = event.params.expiration
		trace.originalSize = BigInt.fromU32(0)
		trace.timestamp = event.block.timestamp
		trace.txHash = event.transaction.hash
		trace.status = "Removed"
		trace.save()
	}
}

export function handleUpdate(event: Update): void {
	const id = `${event.params.to.toHex()}-${event.params.cid}`
	let trace = CIDTrace.load(id)
	if (trace) {
		trace = new CIDTrace(id)
		trace.expiration = event.params.expiration
		trace.size = event.params.size
		trace.originalSize = event.params.originalSize
		trace.timestamp = event.block.timestamp
		trace.txHash = event.transaction.hash
		trace.status = "Updated"
		trace.save()
	}
}

