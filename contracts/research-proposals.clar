;; Research Proposals Contract

(define-data-var last-proposal-id uint u0)

(define-map proposals
  uint
  {
    researcher: principal,
    title: (string-ascii 100),
    description: (string-utf8 1000),
    funding-goal: uint,
    current-funding: uint,
    status: (string-ascii 20)
  }
)

(define-private (get-and-increment-proposal-id)
  (let
    (
      (current-id (var-get last-proposal-id))
      (new-id (+ u1 current-id))
    )
    (var-set last-proposal-id new-id)
    new-id
  )
)

(define-public (submit-proposal (title (string-ascii 100)) (description (string-utf8 1000)) (funding-goal uint))
  (let
    (
      (new-id (get-and-increment-proposal-id))
    )
    (map-set proposals new-id
      {
        researcher: tx-sender,
        title: title,
        description: description,
        funding-goal: funding-goal,
        current-funding: u0,
        status: "pending"
      }
    )
    (ok new-id)
  )
)

(define-public (fund-proposal (proposal-id uint) (amount uint))
  (let
    (
      (proposal (unwrap! (map-get? proposals proposal-id) (err u404)))
      (new-funding (+ (get current-funding proposal) amount))
    )
    (try! (stx-transfer? amount tx-sender (as-contract tx-sender)))
    (map-set proposals proposal-id
      (merge proposal { current-funding: new-funding })
    )
    (if (>= new-funding (get funding-goal proposal))
      (map-set proposals proposal-id
        (merge proposal { current-funding: new-funding, status: "funded" })
      )
      true
    )
    (ok true)
  )
)

(define-read-only (get-proposal (proposal-id uint))
  (map-get? proposals proposal-id)
)

