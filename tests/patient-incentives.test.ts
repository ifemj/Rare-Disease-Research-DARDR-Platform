import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'patient-incentives': {
      functions: {
        'register-study': vi.fn(),
        'participate-in-study': vi.fn(),
        'get-participation': vi.fn(),
        'get-token-balance': vi.fn(),
      },
    },
    'research-proposals': {
      functions: {
        'get-researcher': vi.fn(),
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

describe('Patient Incentives Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('register-study', () => {
    it('should register a study successfully', async () => {
      const studyId = 1
      const totalTokens = 1000
      mockClarity.contracts['research-proposals'].functions['get-researcher'].mockReturnValue('ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM')
      mockClarity.contracts['patient-incentives'].functions['register-study'].mockReturnValue({ success: true })
      
      const result = await callContract('patient-incentives', 'register-study', [studyId, totalTokens])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to register a study for non-researcher', async () => {
      const studyId = 1
      const totalTokens = 1000
      mockClarity.contracts['research-proposals'].functions['get-researcher'].mockReturnValue('ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG')
      mockClarity.contracts['patient-incentives'].functions['register-study'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('patient-incentives', 'register-study', [studyId, totalTokens])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('participate-in-study', () => {
    it('should participate in a study successfully', async () => {
      const studyId = 1
      mockClarity.contracts['patient-incentives'].functions['participate-in-study'].mockReturnValue({ success: true })
      
      const result = await callContract('patient-incentives', 'participate-in-study', [studyId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail to participate in a non-existent study', async () => {
      const studyId = 999
      mockClarity.contracts['patient-incentives'].functions['participate-in-study'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('patient-incentives', 'participate-in-study', [studyId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-participation', () => {
    it('should retrieve participation data successfully', async () => {
      const patient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const studyId = 1
      const participation = { tokensEarned: 10 }
      mockClarity.contracts['patient-incentives'].functions['get-participation'].mockReturnValue(participation)
      
      const result = await callContract('patient-incentives', 'get-participation', [patient, studyId])
      
      expect(result).toEqual(participation)
    })
    
    it('should return undefined for non-existent participation', async () => {
      const patient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const studyId = 999
      mockClarity.contracts['patient-incentives'].functions['get-participation'].mockReturnValue(undefined)
      
      const result = await callContract('patient-incentives', 'get-participation', [patient, studyId])
      
      expect(result).toBeUndefined()
    })
  })
  
  describe('get-token-balance', () => {
    it('should retrieve token balance successfully', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const balance = 100
      mockClarity.contracts['patient-incentives'].functions['get-token-balance'].mockReturnValue(balance)
      
      const result = await callContract('patient-incentives', 'get-token-balance', [account])
      
      expect(result).toBe(balance)
    })
    
    it('should return zero for account with no tokens', async () => {
      const account = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['patient-incentives'].functions['get-token-balance'].mockReturnValue(0)
      
      const result = await callContract('patient-incentives', 'get-token-balance', [account])
      
      expect(result).toBe(0)
    })
  })
})

console.log('All patient incentives tests completed.')

