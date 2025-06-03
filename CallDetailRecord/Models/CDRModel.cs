namespace CallDetailRecord.Models
{
    public class CDRModel
    {
        public string Caller { get; set; }
        public string Receiver { get; set; }
        public DateTime StartTime { get; set; }
        public long Duration { get; set; }
    }
}
