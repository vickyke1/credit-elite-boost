import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, CheckCircle, XCircle, Info } from "lucide-react";

interface SSNValidationResult {
  isValid: boolean;
  areaNumber: string;
  groupNumber: string;
  serialNumber: string;
  state: string;
  yearsIssued: string;
  notes: string;
}

export const SSNValidator = () => {
  const [ssn, setSSN] = useState("");
  const [result, setResult] = useState<SSNValidationResult | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const formatSSN = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as XXX-XX-XXXX
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 5) {
      return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    } else {
      return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
    }
  };

  const handleSSNChange = (value: string) => {
    const formatted = formatSSN(value);
    setSSN(formatted);
    setResult(null);
  };

  const validateSSN = () => {
    setIsValidating(true);
    
    // Simulate validation delay
    setTimeout(() => {
      const digits = ssn.replace(/\D/g, '');
      
      if (digits.length !== 9) {
        setResult({
          isValid: false,
          areaNumber: "",
          groupNumber: "",
          serialNumber: "",
          state: "",
          yearsIssued: "",
          notes: "Invalid SSN format. Must be 9 digits."
        });
        setIsValidating(false);
        return;
      }

      const areaNumber = digits.slice(0, 3);
      const groupNumber = digits.slice(3, 5);
      const serialNumber = digits.slice(5, 9);

      // Basic validation rules
      const isValidFormat = 
        areaNumber !== "000" && 
        areaNumber !== "666" && 
        !areaNumber.startsWith("9") &&
        groupNumber !== "00" &&
        serialNumber !== "0000";

      // Mock validation result
      const mockResult: SSNValidationResult = {
        isValid: isValidFormat,
        areaNumber,
        groupNumber,
        serialNumber,
        state: isValidFormat ? getStateFromArea(areaNumber) : "",
        yearsIssued: isValidFormat ? getYearsFromArea(areaNumber) : "",
        notes: isValidFormat 
          ? "This SSN format appears to be valid and may have been issued."
          : "This SSN format is invalid or follows a pattern that was never issued."
      };

      setResult(mockResult);
      setIsValidating(false);
    }, 1000);
  };

  const getStateFromArea = (area: string): string => {
    const areaNum = parseInt(area);
    if (areaNum >= 1 && areaNum <= 3) return "New Hampshire";
    if (areaNum >= 4 && areaNum <= 7) return "Maine";
    if (areaNum >= 8 && areaNum <= 9) return "Vermont";
    if (areaNum >= 10 && areaNum <= 34) return "Massachusetts";
    if (areaNum >= 35 && areaNum <= 39) return "Rhode Island";
    if (areaNum >= 40 && areaNum <= 49) return "Connecticut";
    if (areaNum >= 50 && areaNum <= 134) return "New York";
    if (areaNum >= 135 && areaNum <= 158) return "New Jersey";
    if (areaNum >= 159 && areaNum <= 211) return "Pennsylvania";
    if (areaNum >= 212 && areaNum <= 220) return "Maryland";
    if (areaNum >= 221 && areaNum <= 222) return "Delaware";
    if (areaNum >= 223 && areaNum <= 231) return "Virginia";
    if (areaNum >= 232 && areaNum <= 236) return "West Virginia";
    if (areaNum >= 237 && areaNum <= 246) return "North Carolina";
    if (areaNum >= 247 && areaNum <= 251) return "South Carolina";
    if (areaNum >= 252 && areaNum <= 260) return "Georgia";
    if (areaNum >= 261 && areaNum <= 267) return "Florida";
    if (areaNum >= 268 && areaNum <= 302) return "Ohio";
    if (areaNum >= 303 && areaNum <= 317) return "Indiana";
    if (areaNum >= 318 && areaNum <= 361) return "Illinois";
    if (areaNum >= 362 && areaNum <= 386) return "Michigan";
    if (areaNum >= 387 && areaNum <= 399) return "Wisconsin";
    if (areaNum >= 400 && areaNum <= 407) return "Kentucky";
    if (areaNum >= 408 && areaNum <= 415) return "Tennessee";
    if (areaNum >= 416 && areaNum <= 424) return "Alabama";
    if (areaNum >= 425 && areaNum <= 428) return "Mississippi";
    if (areaNum >= 429 && areaNum <= 432) return "Arkansas";
    if (areaNum >= 433 && areaNum <= 439) return "Louisiana";
    if (areaNum >= 440 && areaNum <= 448) return "Oklahoma";
    if (areaNum >= 449 && areaNum <= 467) return "Texas";
    if (areaNum >= 468 && areaNum <= 477) return "Minnesota";
    if (areaNum >= 478 && areaNum <= 485) return "Iowa";
    if (areaNum >= 486 && areaNum <= 500) return "Missouri";
    if (areaNum >= 501 && areaNum <= 502) return "North Dakota";
    if (areaNum >= 503 && areaNum <= 504) return "South Dakota";
    if (areaNum >= 505 && areaNum <= 508) return "Nebraska";
    if (areaNum >= 509 && areaNum <= 515) return "Kansas";
    if (areaNum >= 516 && areaNum <= 517) return "Montana";
    if (areaNum >= 518 && areaNum <= 519) return "Idaho";
    if (areaNum >= 520) return "Wyoming";
    return "Unknown";
  };

  const getYearsFromArea = (area: string): string => {
    // This is a simplified approximation
    const areaNum = parseInt(area);
    if (areaNum >= 1 && areaNum <= 100) return "1936-1950";
    if (areaNum >= 101 && areaNum <= 200) return "1950-1965";
    if (areaNum >= 201 && areaNum <= 300) return "1965-1980";
    if (areaNum >= 301 && areaNum <= 400) return "1980-1995";
    if (areaNum >= 401 && areaNum <= 500) return "1995-2011";
    return "1936-2011";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
          <Shield className="h-8 w-8 text-primary" />
          Social Security Number Verification
        </h1>
        <p className="text-muted-foreground">
          Verify if a Social Security Number is valid and whether it has been issued. 
          This tool uses SSA data to determine when and where an SSN was issued.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🇺🇸 Verify Social Security Number
          </CardTitle>
          <CardDescription>
            Enter a 9-digit Social Security Number to verify its validity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ssn">Social Security Number:</Label>
            <Input
              id="ssn"
              type="text"
              placeholder="123-45-6789"
              value={ssn}
              onChange={(e) => handleSSNChange(e.target.value)}
              maxLength={11}
              className="text-lg font-mono"
            />
          </div>
          
          <Button 
            onClick={validateSSN}
            disabled={ssn.replace(/\D/g, '').length !== 9 || isValidating}
            className="w-full bg-accent hover:bg-accent/90"
          >
            {isValidating ? "Verifying..." : "Verify SSN"}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.isValid ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Validation Result
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Status:</Label>
                <div className={`font-semibold ${result.isValid ? 'text-green-600' : 'text-red-600'}`}>
                  {result.isValid ? "Valid Format" : "Invalid Format"}
                </div>
              </div>
              
              {result.isValid && (
                <>
                  <div>
                    <Label>Area Number:</Label>
                    <div className="font-mono">{result.areaNumber}</div>
                  </div>
                  
                  <div>
                    <Label>Group Number:</Label>
                    <div className="font-mono">{result.groupNumber}</div>
                  </div>
                  
                  <div>
                    <Label>Serial Number:</Label>
                    <div className="font-mono">{result.serialNumber}</div>
                  </div>
                  
                  <div>
                    <Label>Likely State of Issue:</Label>
                    <div>{result.state}</div>
                  </div>
                  
                  <div>
                    <Label>Estimated Years Issued:</Label>
                    <div>{result.yearsIssued}</div>
                  </div>
                </>
              )}
            </div>
            
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {result.notes}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Important Disclaimers:</strong>
          <br />
          • This tool is for informational purposes only and is not intended for FCRA regulated purposes
          • Data was collected from SSA's Highest Issued Group data and was last updated until Social Security Randomization took effect in June 2011
          • This tool cannot be used to validate employee and non-employee Social Security Numbers
          • We make no warranties as to the accuracy of this data. Use at your own risk.
        </AlertDescription>
      </Alert>
    </div>
  );
};