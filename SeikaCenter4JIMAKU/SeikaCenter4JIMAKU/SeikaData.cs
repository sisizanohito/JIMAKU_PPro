using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using SeikaCenter;


namespace Voice
{
    [DataContract]
    class SeikaData
    {
        [DataMember]
        public Dictionary<string, SeikaStruct> Data;

        public SeikaData()
        {
            Data = new Dictionary<string, SeikaStruct>();
            foreach (KeyValuePair<int, string> kvp in SeikaConnect.Instance().scc.AvatorList)
            {
                int id = kvp.Key;
                string name = kvp.Value;
                //Console.WriteLine($"-------------------------------------------------------");
                //Console.WriteLine($"{id}:{name}");
                Data.Add(name, new SeikaStruct(name, id));
                
            }
        }
        //登録名からSeikaStructを検索
        public SeikaStruct GetActor(string name)
        {
            SeikaStruct seikaStruct = Data[name];
            return seikaStruct;
        }
    }

    [DataContract]
    class SeikaStruct
    {
        [DataMember]
        public string name;
        [DataMember]
        public int cid;

        [DataContract]
        public struct Pram {
            [DataMember]
            public decimal value;
            [DataMember]
            public decimal max;
            [DataMember]
            public decimal min;
            [DataMember]
            public decimal step;

            public Pram(decimal _value, decimal _max, decimal _min, decimal _step)
            {
                value = _value;
                max = _max;
                min = _min;
                step = _step;
            }
        }
        [DataMember]
        public Dictionary<string, Pram> parameter;

        public SeikaStruct(string _name,int _cid)
        {
            this.name = _name;
            this.cid = _cid;
            parameter = new Dictionary<string, Pram>();

            var avatorParam = SeikaConnect.Instance().scc.GetAvatorParams_current2(cid);
            foreach (KeyValuePair<string, Dictionary<string, Dictionary<string, decimal>>> prams in avatorParam)
            {
                foreach (KeyValuePair<string, Dictionary<string, decimal>> effectsEmotions in prams.Value)
                {
                    decimal value = effectsEmotions.Value["value"];
                    decimal max = effectsEmotions.Value["max"];
                    decimal min = effectsEmotions.Value["min"];
                    decimal step = effectsEmotions.Value["step"];
                    parameter.Add(prams.Key+"_"+effectsEmotions.Key, new Pram(value, max, min, step));
                }
            }
        }
    }
}
