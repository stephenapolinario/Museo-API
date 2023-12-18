# Details

Date : 2023-11-19 19:26:46

Directory c:\\dev\\projects\\TCC3\\museo-node-typescript

Total : 57 files,  3729 codes, 348 comments, 674 blanks, all 4751 lines

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)

## Files
| filename | language | code | comment | blank | total |
| :--- | :--- | ---: | ---: | ---: | ---: |
| [.eslintrc.js](/.eslintrc.js) | JavaScript | 29 | 0 | 1 | 30 |
| [.prettierrc](/.prettierrc) | JSON | 10 | 0 | 1 | 11 |
| [package.json](/package.json) | JSON | 39 | 0 | 1 | 40 |
| [src/config/config.ts](/src/config/config.ts) | TypeScript | 25 | 0 | 6 | 31 |
| [src/controllers/Admin.ts](/src/controllers/Admin.ts) | TypeScript | 138 | 5 | 23 | 166 |
| [src/controllers/Beacon.ts](/src/controllers/Beacon.ts) | TypeScript | 84 | 0 | 16 | 100 |
| [src/controllers/Coupon/Coupon.ts](/src/controllers/Coupon/Coupon.ts) | TypeScript | 136 | 0 | 26 | 162 |
| [src/controllers/Coupon/CouponAccess.ts](/src/controllers/Coupon/CouponAccess.ts) | TypeScript | 79 | 0 | 12 | 91 |
| [src/controllers/Coupon/CouponType.ts](/src/controllers/Coupon/CouponType.ts) | TypeScript | 75 | 0 | 9 | 84 |
| [src/controllers/Emblem.ts](/src/controllers/Emblem.ts) | TypeScript | 107 | 1 | 19 | 127 |
| [src/controllers/MuseumInformation.ts](/src/controllers/MuseumInformation.ts) | TypeScript | 136 | 0 | 20 | 156 |
| [src/controllers/MuseumPiece.ts](/src/controllers/MuseumPiece.ts) | TypeScript | 119 | 0 | 21 | 140 |
| [src/controllers/Product/Category.ts](/src/controllers/Product/Category.ts) | TypeScript | 75 | 0 | 12 | 87 |
| [src/controllers/Product/Product.ts](/src/controllers/Product/Product.ts) | TypeScript | 120 | 2 | 18 | 140 |
| [src/controllers/Quiz.ts](/src/controllers/Quiz.ts) | TypeScript | 224 | 30 | 48 | 302 |
| [src/controllers/SendEmail.ts](/src/controllers/SendEmail.ts) | TypeScript | 33 | 0 | 5 | 38 |
| [src/controllers/Ticket.ts](/src/controllers/Ticket.ts) | TypeScript | 78 | 0 | 12 | 90 |
| [src/controllers/Tour.ts](/src/controllers/Tour.ts) | TypeScript | 101 | 3 | 20 | 124 |
| [src/controllers/User.ts](/src/controllers/User.ts) | TypeScript | 442 | 23 | 96 | 561 |
| [src/library/Logging.ts](/src/library/Logging.ts) | TypeScript | 25 | 0 | 6 | 31 |
| [src/middleware/Coupon.ts](/src/middleware/Coupon.ts) | TypeScript | 49 | 0 | 8 | 57 |
| [src/middleware/Product.ts](/src/middleware/Product.ts) | TypeScript | 19 | 0 | 4 | 23 |
| [src/middleware/SignUp.ts](/src/middleware/SignUp.ts) | TypeScript | 34 | 1 | 6 | 41 |
| [src/middleware/ValidateSchema.ts](/src/middleware/ValidateSchema.ts) | TypeScript | 404 | 7 | 4 | 415 |
| [src/middleware/VerifyAdmin.ts](/src/middleware/VerifyAdmin.ts) | TypeScript | 30 | 3 | 5 | 38 |
| [src/models/Admin.ts](/src/models/Admin.ts) | TypeScript | 28 | 0 | 5 | 33 |
| [src/models/Beacon.ts](/src/models/Beacon.ts) | TypeScript | 22 | 0 | 5 | 27 |
| [src/models/Counter.ts](/src/models/Counter.ts) | TypeScript | 22 | 0 | 5 | 27 |
| [src/models/Coupon/Coupon.ts](/src/models/Coupon/Coupon.ts) | TypeScript | 43 | 0 | 5 | 48 |
| [src/models/Coupon/CouponAccess.ts](/src/models/Coupon/CouponAccess.ts) | TypeScript | 18 | 0 | 5 | 23 |
| [src/models/Coupon/CouponType.ts](/src/models/Coupon/CouponType.ts) | TypeScript | 18 | 0 | 5 | 23 |
| [src/models/Emblem.ts](/src/models/Emblem.ts) | TypeScript | 38 | 0 | 5 | 43 |
| [src/models/MuseumInformation.ts](/src/models/MuseumInformation.ts) | TypeScript | 117 | 0 | 11 | 128 |
| [src/models/MuseumPiece.ts](/src/models/MuseumPiece.ts) | TypeScript | 54 | 0 | 5 | 59 |
| [src/models/Product/Category.ts](/src/models/Product/Category.ts) | TypeScript | 17 | 0 | 5 | 22 |
| [src/models/Product/Product.ts](/src/models/Product/Product.ts) | TypeScript | 52 | 0 | 5 | 57 |
| [src/models/Quiz.ts](/src/models/Quiz.ts) | TypeScript | 77 | 0 | 9 | 86 |
| [src/models/Role.ts](/src/models/Role.ts) | TypeScript | 17 | 0 | 5 | 22 |
| [src/models/Ticket.ts](/src/models/Ticket.ts) | TypeScript | 32 | 0 | 5 | 37 |
| [src/models/Tour.ts](/src/models/Tour.ts) | TypeScript | 27 | 0 | 4 | 31 |
| [src/models/User.ts](/src/models/User.ts) | TypeScript | 137 | 0 | 9 | 146 |
| [src/routes/Admin.ts](/src/routes/Admin.ts) | TypeScript | 21 | 6 | 9 | 36 |
| [src/routes/Beacon.ts](/src/routes/Beacon.ts) | TypeScript | 15 | 5 | 8 | 28 |
| [src/routes/Coupon/Access.ts](/src/routes/Coupon/Access.ts) | TypeScript | 24 | 5 | 8 | 37 |
| [src/routes/Coupon/Coupon.ts](/src/routes/Coupon/Coupon.ts) | TypeScript | 26 | 13 | 13 | 52 |
| [src/routes/Coupon/Type.ts](/src/routes/Coupon/Type.ts) | TypeScript | 24 | 5 | 8 | 37 |
| [src/routes/Emblem.ts](/src/routes/Emblem.ts) | TypeScript | 15 | 12 | 11 | 38 |
| [src/routes/MuseumInformation.ts](/src/routes/MuseumInformation.ts) | TypeScript | 18 | 16 | 10 | 44 |
| [src/routes/MuseumPiece.ts](/src/routes/MuseumPiece.ts) | TypeScript | 20 | 13 | 12 | 45 |
| [src/routes/Product/Category.ts](/src/routes/Product/Category.ts) | TypeScript | 19 | 12 | 11 | 42 |
| [src/routes/Product/Product.ts](/src/routes/Product/Product.ts) | TypeScript | 21 | 13 | 12 | 46 |
| [src/routes/Quiz.ts](/src/routes/Quiz.ts) | TypeScript | 16 | 29 | 13 | 58 |
| [src/routes/Ticket.ts](/src/routes/Ticket.ts) | TypeScript | 15 | 12 | 11 | 38 |
| [src/routes/Tour.ts](/src/routes/Tour.ts) | TypeScript | 16 | 13 | 12 | 41 |
| [src/routes/User.ts](/src/routes/User.ts) | TypeScript | 39 | 19 | 18 | 76 |
| [src/server.ts](/src/server.ts) | TypeScript | 95 | 11 | 17 | 123 |
| [tsconfig.json](/tsconfig.json) | JSON with Comments | 15 | 89 | 9 | 113 |

[Summary](results.md) / Details / [Diff Summary](diff.md) / [Diff Details](diff-details.md)