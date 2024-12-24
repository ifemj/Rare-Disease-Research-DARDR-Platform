;; Patient Incentives Contract

(define-fungible-token patient-token)

(define-map patient-participation
  { patient: principal, study-id: uint }
  { tokens-earned: uint }
)

(define-public (register-study (study-id uint) (total-tokens uint))
  (begin
    (try! (ft-mint? patient-token total-tokens (as-contract tx-sender)))
    (ok true)
  )
)

(define-public (participate-in-study (study-id uint))
  (let
    (
      (current-participation (default-to { tokens-earned: u0 }
        (map-get? patient-participation { patient: tx-sender, study-id: study-id })))
    )
    (map-set patient-participation
      { patient: tx-sender, study-id: study-id }
      { tokens-earned: (+ (get tokens-earned current-participation) u1) }
    )
    (try! (as-contract (ft-transfer? patient-token u1 (as-contract tx-sender) tx-sender)))
    (ok true)
  )
)

(define-read-only (get-participation (patient principal) (study-id uint))
  (map-get? patient-participation { patient: patient, study-id: study-id })
)

(define-read-only (get-token-balance (account principal))
  (ft-get-balance patient-token account)
)

