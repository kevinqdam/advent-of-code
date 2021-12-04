import Data.Char (isSpace)

trim :: String -> String
trim = let f = reverse . dropWhile isSpace in f . f

stringToInt :: String -> Int
stringToInt = read

countIncreaseFromPrevious :: [Int] -> Int
countIncreaseFromPrevious xs =
  let aux :: [Int] -> Int -> Int -> Int
      aux []     _    acc = acc
      aux [x]    prev acc = if x > prev then acc + 1 else acc
      aux (x:xs) prev acc
        | (x > prev) = aux xs x (acc + 1)
        | otherwise  = aux xs x acc
  in aux xs (head xs + 1) 0

countIncreaseFromPreviousFromFromFileContents :: String -> Int
countIncreaseFromPreviousFromFromFileContents = countIncreaseFromPrevious . map stringToInt . lines . trim

processFile :: FilePath -> IO Int
processFile = fmap countIncreaseFromPreviousFromFromFileContents <$> readFile
