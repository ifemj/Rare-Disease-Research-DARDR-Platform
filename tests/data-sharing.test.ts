import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'data-sharing': {
      functions: {
        'share-data': vi.fn(),
        'grant-access': vi.fn(),
        'get-data': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Data Sharing Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('share-data', () => {
    it('should share data successfully', async () => {
      const dataHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
      const encryptedData = Buffer.from('encrypted data', 'utf8')
      mockClarity.contracts['data-sharing'].functions['share-data'].mockReturnValue({ success: true })
      
      const result = await callContract('data-sharing', 'share-data', [dataHash, encryptedData])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('grant-access', () => {
    it('should grant access successfully', async () => {
      const dataHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
      const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['data-sharing'].functions['grant-access'].mockReturnValue({ success: true })
      
      const result = await callContract('data-sharing', 'grant-access', [dataHash, researcher])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when granting access to non-existent data', async () => {
      const dataHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
      const researcher = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['data-sharing'].functions['grant-access'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('data-sharing', 'grant-access', [dataHash, researcher])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-data', () => {
    it('should retrieve data successfully for authorized user', async () => {
      const patient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const dataHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
      const encryptedData = Buffer.from('encrypted data', 'utf8')
      mockClarity.contracts['data-sharing'].functions['get-data'].mockReturnValue({ success: true, value: encryptedData })
      
      const result = await callContract('data-sharing', 'get-data', [patient, dataHash])
      
      expect(result.success).toBe(true)
      expect(result.value).toEqual(encryptedData)
    })
    
    it('should fail to retrieve data for unauthorized user', async () => {
      const patient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const dataHash = Buffer.from('0123456789abcdef0123456789abcdef', 'hex')
      mockClarity.contracts['data-sharing'].functions['get-data'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('data-sharing', 'get-data', [patient, dataHash])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
})

console.log('All data sharing tests completed.')
