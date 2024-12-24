;; Data Sharing Contract

(define-map patient-data
  { patient: principal, data-hash: (buff 32) }
  { encrypted-data: (buff 1024), access-control: (list 10 principal) }
)

(define-public (share-data (data-hash (buff 32)) (encrypted-data (buff 1024)))
  (begin
    (map-set patient-data
      { patient: tx-sender, data-hash: data-hash }
      { encrypted-data: encrypted-data, access-control: (list) }
    )
    (ok true)
  )
)

(define-public (grant-access (data-hash (buff 32)) (researcher principal))
  (let
    (
      (data (unwrap! (map-get? patient-data { patient: tx-sender, data-hash: data-hash }) (err u404)))
    )
    (map-set patient-data
      { patient: tx-sender, data-hash: data-hash }
      (merge data { access-control: (unwrap! (as-max-len? (append (get access-control data) researcher) u10) (err u401)) })
    )
    (ok true)
  )
)

(define-read-only (get-data (patient principal) (data-hash (buff 32)))
  (let
    (
      (data (unwrap! (map-get? patient-data { patient: patient, data-hash: data-hash }) (err u404)))
    )
    (asserts! (or (is-eq tx-sender patient) (is-some (index-of (get access-control data) tx-sender))) (err u403))
    (ok (get encrypted-data data))
  )
)

